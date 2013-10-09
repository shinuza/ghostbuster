var util = require('util')
  , fs = require('fs')
  , path = require('path')
  , express = require('express')
  , spawn = require('child_process').spawn
  , swig = require('swig')

  , Jobs = require('./lib/jobs.js')
  , Optimizer = require('./lib/report-optimizer.js')
  , app = express();

const PHANTOMJS = 'phantomjs';
const GHOSTBUSTER = 'ghostbuster.js';
const WORK_DIR = __dirname + '/work/';
const CACHE_DIR = __dirname + '/cache/';

var jobs = new Jobs();
var optimizer = new Optimizer(WORK_DIR);

swig.setDefaults({ cache: false });
app.use(express.bodyParser());
app.use(express.static(__dirname + '/public'));
app.use(express.static(CACHE_DIR));
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.set('view cache', false);
app.listen(3000, '0.0.0.0');

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/jobs/:id', function(req, res) {
  var id = req.params.id;

  jobs.on('failed:' + id, function() {
    console.log('failed', id);
    res.json(500, {error: 'Failed'});
  });

  jobs.on('finished:' + id, function() {
    console.log('done', id);
    optimizer.dump();
    res.json({id: id});
  });
});

app.post('/jobs', function(req, res) {
  var params = req.body
    , jobID = jobs.register(function(id) {
    return spawn(PHANTOMJS, [GHOSTBUSTER, params.url, params.width, params.height, __dirname + '/work/' + id]);
  });

  return res.json(202, {id: jobID});
});


app.get('/reports/:id', function(req, res) {
  var report = getReport(req.params.id);
  if(report) {
    res.render('report', {report: report});
  } else {
    res.status(404).render('404');
  }
});

app.get('/reports', function(req, res) {
  optimizer.dump();

  fs.readdir(CACHE_DIR, function(err, reports) {
    if(!err && reports.length) {
      reports = reports.map(function(entry) {
        return getReport(entry);
      });
    }

    res.render('reports', { reports: reports || []});
  });
});

app.get('/wait/:id', function(req, res) {
  res.render('wait', {id: req.params.id});
});

function getReport(id) {
  var report;
  try {
    report = require(path.join(CACHE_DIR, id, 'report.json'));
  } catch(e) {
    report = null;
  }
  return report;
}
