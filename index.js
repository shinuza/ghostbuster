var util = require('util')
  , fs = require('fs')
  , express = require('express')
  , spawn = require('child_process').spawn
  , swig = require('swig')
  , Jobs = require('./lib/jobs.js')
  , app = express();

var jobs = new Jobs();
const PHANTOMJS = 'phantomjs';
const GHOSTBUSTER = 'ghostbuster.js';
const WORK_DIR = __dirname + '/work/';

swig.setDefaults({ cache: false });
app.use(express.bodyParser());
app.use(express.static(__dirname + '/public'));
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

app.get('/work/:id', function(req, res) {
  var id = req.params.id;
  fs.readFile(path.join(WORK_DIR, id), function(err, buf) {
    if(err) {
      res
        .status(500)
        .end(util.format('console.error("Unable to find job with id: %s");', id));
    } else {
      res.end(buf);
    }
  });
});

app.get('/reports/:id', function(req, res) {
  res.render('report', {id: req.params.id});
});

app.get('/wait/:id', function(req, res) {
  res.render('wait', {id: req.params.id});
});
