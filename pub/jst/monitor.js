#!/usr/bin/env node
var exts, fs, path, pub, render, throttles,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

path = process.cwd() + '/';

pub = path + 'pub/';

fs = require('fs');

render = require('./render');

throttles = [];

exts = ['jade', 'styl', 'json', 'yml'];

render.stylus();

render.jade();

fs.watch(path, {
  persistent: true,
  recursive: true
}, function(event, filename) {
  var dirs, ext, name;
  ext = filename.split('.').pop();
  dirs = filename.split('/');
  name = dirs.pop();
  if (indexOf.call(exts, ext) < 0 || indexOf.call(throttles, filename) >= 0) {
    return true;
  }
  throttles.push(filename);
  setTimeout(function() {
    return throttles = throttles.filter(function(throttle) {
      return throttle !== filename;
    });
  }, 200);
  if (ext === 'yml') {
    render.stylus();
    render.jade();
  }
  if (ext === 'styl') {
    render.stylus();
  }
  if (ext === 'jade') {
    return render.jade();
  }
});
