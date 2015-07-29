
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

  for section in sections
    if section is 'index' then file = pub + 'index.html' else file = pub + "#{section}/index.html"
    fs.writeFile file, jade.renderFile("#{path}tpl/#{section}.jade", locals), (error) ->
      console.log error if error
    exports.report 'jade', "#{path}tpl/#{section}.jade", file

exports.stylus = ->

  data = this.slurp(path + 'dat')

  str = fs.readFileSync "#{path}sty/main.styl", 'utf8'
  stylus(str).set('filename', "#{path}sty/main.styl").use(exports.sty).define('data', data, true).render (error, css) ->
    console.log error if error
    fs.writeFileSync "#{pub}css/main.css", css, 'utf8'
    exports.report 'styl', "#{path}sty/main.styl", "#{pub}css/main.css"

exports.sty = (style) ->
  style.set 'paths', ["#{path}sty"]

exports.report = (engine, from, to) ->
  engine = co.cyan engine if engine is 'jade'
  engine = co.magenta engine if engine is 'styl'
  from = co.yellow from
  to = co.green to
  stamp = moment().format('M/D/YY h:mm:ss,SSa')
  console.log "[#{stamp}] [#{engine}] #{from} -> #{to}"

