
path = process.cwd()+'/'
pub = path+'pub/'

fs = require 'fs'
jade = require 'jade'
stylus = require 'stylus'
moment = require 'moment'
yaml = require 'js-yaml'
co = require 'colors'
assign = Object.assign || require('object.assign')

exports.data = () ->

exports.stack = (dir, data, key) ->

  if !fs.existsSync(dir)
    console.log 'No data folder found, you probably have not initialized your structure yet, please run :'
    console.log "\r\n"
    console.log 'node_modules/luja/scr/init.sh'
    console.log "\r\n"

    process.exit()
    return false

  files = fs.readdirSync(dir)

  for file in files
    fileFull = dir + '/' + file

    if fs.lstatSync(fileFull).isDirectory()
      data = assign data, this.stack(fileFull, data, file)
    else
      fileExt = file.split '.'
      data[key] = {} if !(key of data)


      if fileExt[1] is 'json'
        data[key][fileExt[0]] = JSON.parse fs.readFileSync fileFull, 'utf8'
      if fileExt[1] is 'yml' or fileExt[1] is 'yaml'
        data[key][fileExt[0]] = yaml.safeLoad fs.readFileSync fileFull, 'utf8'

  return data

exports.slurp = (path) ->
  data = this.stack(path, {}, 'root')
  root = data.root
  delete data.root
  data = assign root, data
  return data

exports.jade = (section) ->

  if !fs.existsSync(path + 'dat')
    console.log 'No data folder found, you probably have not initialized your structure yet, please run :'
    console.log "\r\n"
    console.log 'node_modules/luja/scr/init.sh'
    console.log "\r\n"

    process.exit()
    return false

  data = this.slurp(path + 'dat')

  locals =
    pretty: true
    data: data

  if section isnt undefined then sections = [section] else sections = data.config.sections

  # write our index.html
  jade.renderFile "#{path}tpl/index.jade", locals, (err, html) ->
    if err
      console.log err
    else
      fs.writeFile pub + 'index.html', html, (error) ->
        console.log error if error
      exports.report 'jade', "./tpl/index.jade", './index.html'

  for section in sections
    file = pub + "#{section}/index.html"

    if !fs.existsSync(pub + section)
      fs.mkdirSync(pub + section)
      exports.report 'self', 'created ' + pub + section

    # write our sections index.html
    jade.renderFile "#{path}tpl/#{section}/index.jade", locals, (err, html) ->
      if err
        console.log err
      else
        fs.writeFile pub + section + '/index.html', html, (error) ->
          console.log error if error
        exports.report 'jade', "./tpl/#{section}/index.jade", './pub/' + section + '/index.html'

exports.stylus = ->

  data = this.slurp(path + 'dat')

  str = fs.readFileSync "#{path}sty/main.styl", 'utf8'
  stylus(str)
    .set('filename', "#{path}sty/main.styl")
    .use(exports.sty)
    .define('data', data, true)
    .render (error, css) ->
      console.log error if error
      fs.writeFileSync "#{pub}css/main.css", css, 'utf8'
      exports.report 'styl', "./sty/main.styl", "./pub/css/main.css"

exports.sty = (style) ->
  style.set 'paths', ["#{path}sty"]

exports.report = (engine, from, to) ->
  engine = co.cyan engine if engine is 'jade'
  engine = co.magenta engine if engine is 'styl'
  engine = co.blue engine if engine is 'self'

  stamp = co.grey moment().format('M/D/YY h:mm:ss,SSa')

  if to is undefined
    from = co.white from
    console.log "[#{stamp}] [#{engine}] #{from}"
    return true

  from = co.yellow from
  to = co.green to
  console.log "[#{stamp}] [#{engine}] #{from} -> #{to}"

