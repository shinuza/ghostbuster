var util = require('util')
  , express = require('express')
  , spawn = require('child_process').spawn
  , swig = require('swig')
  , Jobs = require('./lib/jobs.js')
  , app = express();

var jobs = new Jobs();
const PHANTOMJS = 'phantomjs';
const GHOSTBUSTER = 'ghostbuster.js';

app.use(express.bodyParser());
app.use(express.static(__dirname + '/public'));
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.listen(3000);

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
    , jobID = jobs.register(function() {
    return spawn(PHANTOMJS, [GHOSTBUSTER, params.url, params.width, params.height]);
  });

  return res.redirect('/wait/' + jobID);
});

app.get('/report/:id', function(req, res) {
  res.render('report');
});

app.get('/wait/:id', function(req, res) {
  res.render('wait', {id: req.params.id});
});
