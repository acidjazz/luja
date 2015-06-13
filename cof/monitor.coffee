
pub = __dirname.substring 0, __dirname.length-3
path = __dirname.substring 0, __dirname.length-7

fs = require 'fs'
render = require "#{pub}jst/render.js"

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
    # console.log "event: #{event} file: #{filename} name: #{name} ext: #{ext}"

    if ext not in exts or filename in throttles
      return true

    throttles.push filename

    setTimeout ->
      throttles = throttles.filter (throttle) -> throttle isnt filename
    , 200

    if ext is 'styl'
      render.stylus()
  
    if ext is 'jade'
      if dirs[1] isnt undefined and dirs[1] is 'inc'
        render.jade()
      else
        render.jade name.split('.')[0]

