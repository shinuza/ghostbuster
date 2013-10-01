var util = require('util')
  , uuid = require('node-uuid')
  , EventEmitter = require('events').EventEmitter;

module.exports = Jobs;

function Jobs() {
  EventEmitter.call(this);
}
util.inherits(Jobs, EventEmitter);

Jobs.prototype.register = function register(fn) {
  var child = fn()
    , id = uuid.v1();

  child.on('error', function() {
    this.emit('failed', id);
    this.emit('failed:' + id);
  }.bind(this));

  child.on('close', function() {
    this.emit('finished', id);
    this.emit('finished:' + id);
  }.bind(this));

  return id;
};