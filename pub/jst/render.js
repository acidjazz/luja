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
  if (!fs.existsSync(dir)) {
    console.log('No data folder found, you probably have not initialized your structure yet, please run :');
    console.log("\r\n");
    console.log('node_modules/luja/scr/init.sh');
    console.log("\r\n");
    process.exit();
    return false;
  }
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
  jade.renderFile(path + "tpl/index.jade", locals, function(err, html) {
    if (err) {
      return console.log(err);
    } else {
      fs.writeFile(pub + 'index.html', html, function(error) {
        if (error) {
          return console.log(error);
        }
      });
      return exports.report('jade', "./tpl/index.jade", './index.html');
    }
  });
  results = [];
  for (i = 0, len = sections.length; i < len; i++) {
    section = sections[i];
    file = pub + (section + "/index.html");
    if (!fs.existsSync(pub + section)) {
      fs.mkdirSync(pub + section);
      exports.report('self', 'created ' + pub + section);
    }
    results.push(jade.renderFile(path + "tpl/" + section + "/index.jade", locals, function(err, html) {
      if (err) {
        return console.log(err);
      } else {
        fs.writeFile(pub + section + '/index.html', html, function(error) {
          if (error) {
            return console.log(error);
          }
        });
        return exports.report('jade', "./tpl/" + section + "/index.jade", './pub/' + section + '/index.html');
      }
    }));
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
    return exports.report('styl', "./sty/main.styl", "./pub/css/main.css");
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
  if (engine === 'self') {
    engine = co.blue(engine);
  }
  stamp = co.grey(moment().format('M/D/YY h:mm:ss,SSa'));
  if (to === void 0) {
    from = co.white(from);
    console.log("[" + stamp + "] [" + engine + "] " + from);
    return true;
  }
  from = co.yellow(from);
  to = co.green(to);
  return console.log("[" + stamp + "] [" + engine + "] " + from + " -> " + to);
};
