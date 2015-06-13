
pub = __dirname.substring 0, __dirname.length-3
path = __dirname.substring 0, __dirname.length-7

rd = require 'require-directory'
fs = require 'fs'
jade = require 'jade'
stylus = require 'stylus'
moment = require 'moment'
co = require 'colors'

exports.jade = (section) ->

  jsn = rd(module, path + 'jsn/')
  locals =
    pretty: true
    jsn: jsn

  if section isnt undefined then sections = [section] else sections = jsn.config.sections

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

