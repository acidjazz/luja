var co, fs, jade, moment, path, pub, rd, stylus;

pub = __dirname.substring(0, __dirname.length - 3);

path = __dirname.substring(0, __dirname.length - 7);

rd = require('require-directory');

fs = require('fs');

jade = require('jade');

stylus = require('stylus');

moment = require('moment');

co = require('colors');

exports.jade = function(section) {
  var file, i, jsn, len, locals, results, sections;
  jsn = rd(module, path + 'jsn/');
  locals = {
    pretty: true,
    jsn: jsn
  };
  if (section !== void 0) {
    sections = [section];
  } else {
    sections = jsn.config.sections;
  }
  results = [];
  for (i = 0, len = sections.length; i < len; i++) {
    section = sections[i];
    if (section === 'index') {
      file = pub + 'index.html';
    } else {
      file = pub + (section + "/index.html");
    }
    fs.writeFile(file, jade.renderFile(path + "tpl/" + section + ".jade", locals), function(error) {
      if (error) {
        return console.log(error);
      }
    });
    results.push(exports.report('jade', path + "tpl/" + section + ".jade", file));
  }
  return results;
};

exports.stylus = function() {
  var str;
  str = fs.readFileSync(path + "sty/main.styl", 'utf8');
  return stylus(str).set('filename', path + "sty/main.styl").use(exports.sty).render(function(error, css) {
    if (error) {
      console.log(error);
    }
    fs.writeFileSync(pub + "css/main.css", css, 'utf8');
    return exports.report('styl', path + "sty/main.styl", pub + "css/main.css");
  });
};

exports.sty = function(style) {
  return style.set('paths', [path + "sty"]);
};

exports.report = function(engine, from, to) {
  var stamp;
  if (engine === 'jade') {
    engine = co.cyan(engine);
  }
  if (engine === 'styl') {
    engine = co.magenta(engine);
  }
  from = co.yellow(from);
  to = co.green(to);
  stamp = moment().format('M/D/YY h:mm:ss,SSa');
  return console.log("[" + stamp + "] [" + engine + "] " + from + " -> " + to);
};
