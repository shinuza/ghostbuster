var path = require('path')
  , fs = require('fs');

function Optimizer(dir) {
  this.reports = [];
  this.dir = dir;

  this.register();
}

Optimizer.prototype.register = function register() {
  this.reports = fs.readdirSync(this.dir);
};

Optimizer.prototype.dump = function dump() {
  this.reports.forEach(function(report) {
    var file = path.join(this.dir, report)
      , id = path.basename(file, '.json')
      , dirname = path.join('cache', id);

    if(!fs.existsSync(dirname)) {
      var data = require(path.join(this.dir, report));

      // Create cache directory
      fs.mkdirSync(dirname);

      // Set id
      data.id = id;

      // Dump clips
      data.clips = data.clips.map(function(clip) {
        var outputPath = path.join(dirname, this.formatDate(clip.date) + '.png');

        fs.writeFileSync(outputPath, new Buffer(clip.imageData, 'base64'), {
          encoding: 'binary',
          flag: 'w'
        });

        return outputPath;
      }, this);

      // Thumbnail
      data.thumbnail = data.clips[data.clips.length - 1];

      // Dump info
      fs.writeFileSync(path.join(dirname, 'report.json'), JSON.stringify(data));
    }
  }, this);
};

Optimizer.prototype.formatDate = function formatDate(date) {
  return new Date(+date).toJSON()
    .replace(/[\:]/g, '-')
    .replace('T', '_')
    .replace(/\.\d{3}Z$/, '');
};

module.exports = Optimizer;