
path = process.cwd()+'/'
pub = path+'pub/'

fs = require 'fs'
render = require './render'

throttles = []
exts = ['jade', 'styl', 'json', 'yml']

render.stylus()
render.jade()

fs.watch path,
  persistent: true
  recursive: true
  (event, filename) ->

    ext = filename.split('.').pop()
    dirs = filename.split '/'
    name = dirs.pop()
    #console.log "event: #{event} file: #{filename} name: #{name} ext: #{ext}"

    if ext not in exts or filename in throttles
      return true

    throttles.push filename

    setTimeout ->
      throttles = throttles.filter (throttle) -> throttle isnt filename
    , 200

    if ext is 'yml'
      render.stylus()
      render.jade()

    if ext is 'styl'
      render.stylus()
  
    if ext is 'jade'
      render.jade()

