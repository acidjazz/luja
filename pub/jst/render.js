var assign, co, fs, jade, moment, path, pub, stylus, yaml;

path = process.cwd() + '/';

pub = path + 'pub/';

fs = require('fs');

jade = require('jade');

stylus = require('stylus');

moment = require('moment');

yaml = require('js-yaml');

co = require('colors');

assign = Object.assign || require('object.assign');

exports.data = function() {};

exports.stack = function(dir, data, key) {
  var file, fileExt, fileFull, files, i, len;
  files = fs.readdirSync(dir);
  for (i = 0, len = files.length; i < len; i++) {
    file = files[i];
    fileFull = dir + '/' + file;
    if (fs.lstatSync(fileFull).isDirectory()) {
      data = assign(data, this.stack(fileFull, data, file));
    } else {
      fileExt = file.split('.');
      if (!(key in data)) {
        data[key] = {};
      }
      if (fileExt[1] === 'json') {
        data[key][fileExt[0]] = JSON.parse(fs.readFileSync(fileFull, 'utf8'));
      }
      if (fileExt[1] === 'yml' || fileExt[1] === 'yaml') {
        data[key][fileExt[0]] = yaml.safeLoad(fs.readFileSync(fileFull, 'utf8'));
      }
    }
  }
  return data;
};

exports.slurp = function(path) {
  var data, root;
  data = this.stack(path, {}, 'root');
  root = data.root;
  delete data.root;
  data = assign(root, data);
  return data;
};

exports.jade = function(section) {
  var data, file, i, len, locals, results, sections;
  if (!fs.existsSync(path + 'dat')) {
    console.log('No data folder found, you probably have not initialized your structure yet, please run :');
    console.log("\r\n");
    console.log('node_modules/luja/scr/init.sh');
    console.log("\r\n");
    process.exit();
    return false;
  }
  data = this.slurp(path + 'dat');
  locals = {
    pretty: true,
    data: data
  };
  if (section !== void 0) {
    sections = [section];
  } else {
    sections = data.config.sections;
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
  var data, str;
  data = this.slurp(path + 'dat');
  str = fs.readFileSync(path + "sty/main.styl", 'utf8');
  return stylus(str).set('filename', path + "sty/main.styl").use(exports.sty).define('data', data, true).render(function(error, css) {
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
