var args = require('system').args;
var fs = require('fs');
var page = require('webpage').create();
var interval;
var previous;

page.viewportSize = { width: args[2], height: args[3] };
page.clipRect = { width: args[2], height: args[3] };

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
    clips: clips
  });

  fs.write(args[4], 'var data = ' + json, 'w');
  clearInterval(interval);
  phantom.exit(1);
});