var path = require('path')
  , fs = require('fs');

function Optimizer(dir) {
  this.dir = dir;
}

Optimizer.prototype.dump = function dump() {
  fs.readdirSync(this.dir).forEach(function(report) {
    var file = path.join(this.dir, report)
      , id = path.basename(file, '.json')
      , dirname = path.join('cache', id);

    if(!fs.existsSync(dirname)) {
      var data = require(path.join(this.dir, report));

      // Create cache directory
      fs.mkdirSync(dirname);

      data.id = id;
      data.clips = this._dumpClips(dirname, data.clips);
      data.thumbnail = data.clips[data.clips.length - 1];

      // Dump info
      fs.writeFileSync(path.join(dirname, 'report.json'), JSON.stringify(data));
    }
  }, this);
};

Optimizer.prototype._formatDate = function _formatDate(date) {
  return new Date(+date).toJSON()
    .replace(/[\:]/g, '-')
    .replace('T', '_')
    .replace(/\.\d{3}Z$/, '');
};

Optimizer.prototype._dumpClips = function _dumpClips(dirname, clips) {

  var clipOuputPath = function clipOuputPath(dirname, date) {
    return path.join(dirname, this._formatDate(date) + '.png');
  }.bind(this, dirname);

  return clips.map(function(clip) {
    var outputPath = clipOuputPath(clip.date);
    this._base64ToFile(clip.imageData, outputPath);

    return {
      path: outputPath,
      date: clip.date
    };
  }, this);
};

Optimizer.prototype._base64ToFile = function _base64ToFile(data, outputPath) {
  fs.writeFileSync(outputPath, new Buffer(data, 'base64'), {
    encoding: 'binary',
    flag: 'w'
  });
};

module.exports = Optimizer;