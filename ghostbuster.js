var args = require('system').args;
var fs = require('fs');
var page = require('webpage').create();
var interval;
var clips = [];
var started;
var previous;

page.clipRect = { width: args[2], height: args[3] };

page.onLoadStarted = function() {
  started = +(new Date);
  interval = setInterval(function() {
    var imageData = page.renderBase64('png');
    var clip = {
      imageData: imageData,
      date: +(new Date)
    };

    // Skip identical images
    if(previous != imageData) {
      clips.push(clip);
    }

    previous = imageData;
  }, 200);
};

page.open(args[1], function(status) {
  console.log('Done:', status);
  var json = JSON.stringify({
    started: started,
    clips: clips
  });

  fs.write('test.json', 'var data = ' + json, 'w');
  clearInterval(interval);
  phantom.exit(1);
});