
pub = __dirname.substring 0, __dirname.length-3
path = __dirname.substring 0, __dirname.length-7

fs = require 'fs'
jade = require 'jade'
stylus = require 'stylus'
moment = require 'moment'
yaml = require 'js-yaml'
co = require 'colors'
assign = Object.assign || require('object.assign')


exports.data = () ->

exports.slurp = (dir, data, key) ->

  files = fs.readdirSync(dir)

  for file in files
    fileFull = dir + '/' + file

    if fs.lstatSync(fileFull).isDirectory()
     data = assign data, this.slurp(fileFull, data, file)
    else
      fileExt = file.split '.'
      data[key] = {} if !(key of data)

      if fileExt[1] is 'json'
        data[key][fileExt[0]] = JSON.parse fs.readFileSync fileFull, 'utf8'
      if fileExt[1] is 'yml' or fileExt[1] is 'yaml'
        data[key][fileExt[0]] = yaml.safeLoad fs.readFileSync fileFull, 'utf8'

  return data

exports.jade = (section) ->

  data = this.slurp(path + 'dat', {}, 'root').root

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
  str = fs.readFileSync "#{path}sty/main.styl", 'utf8'
  stylus(str).set('filename', "#{path}sty/main.styl").use(exports.sty).render (error, css) ->
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
