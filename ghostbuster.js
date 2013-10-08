var args = require('system').args;
var fs = require('fs');
var page = require('webpage').create();
var interval;
var previous;

var viewport = { width: args[2], height: args[3] };

page.viewportSize = viewport;
page.clipRect = viewport;

var clips = [];
var started;

function capture() {
  var imageData = page.renderBase64('png');

  // Skip identical images
  if(previous != imageData) {
    clips.push({
      imageData: imageData,
      date: +(new Date)
    });
  }

  previous = imageData;
}

page.onLoadStarted = function() {
  started = +(new Date);
  interval = setInterval(capture, 100);
};


page.open(args[1], function() {
  capture();
  var json = JSON.stringify({
    started: started,
    loaded: +(new Date) - started,
    url: args[1],
    clips: clips,
    viewport: viewport
  });

  fs.write(args[4] + '.json', json, 'w');
  clearInterval(interval);
  phantom.exit(1);
});