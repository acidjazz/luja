var exts, fs, path, pub, render, throttles,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

pub = __dirname.substring(0, __dirname.length - 3);

path = __dirname.substring(0, __dirname.length - 7);

fs = require('fs');

render = require(pub + "jst/render.js");

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
  if (ext === 'styl') {
    render.stylus();
  }
  if (ext === 'jade') {
    if (dirs[1] !== void 0 && dirs[1] === 'inc') {
      return render.jade();
    } else {
      return render.jade(name.split('.')[0]);
    }
  }
});
