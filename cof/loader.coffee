
Loader =

  root: './'

  scripts: {jst: [], jst_lib: [], jst_cune: [], jst_cune_lib: []}

  i: (callback) ->

    @browser = @searchString(@dataBrowser) or "Other"
    @version = @searchVersion(navigator.userAgent) or @searchVersion(navigator.appVersion) or "Unknown"
    @mobile = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    @iPad = /iPad/i.test(navigator.userAgent)
    @iPhone = /iPhone/i.test(navigator.userAgent)
    @Chrome = /Chrome/i.test(navigator.userAgent)
    @Safari = /Safari/i.test(navigator.userAgent) && !Loader.Chrome

    if Loader.compatible()
      Loader.loadscripts Loader.scripts, ->
        if window.cfg isnt 'undefined'
          callback true
        else
          Loader.config ->
            callback true
    else
      callback false

  searchString: (data) ->
    i = 0
    while i < data.length
      dataString = data[i].string
      @versionSearchString = data[i].subString
      return data[i].identity unless dataString.indexOf(data[i].subString) is -1
      i++
    return

  searchVersion: (dataString) ->
    index = dataString.indexOf(@versionSearchString)
    return if index is -1
    parseFloat dataString.substring(index + @versionSearchString.length + 1)

  dataBrowser: [
    { string: navigator.userAgent, subString: "Chrome", identity: "Chrome" }
    { string: navigator.userAgent, subString: "MSIE", identity: "Explorer" }
    { string: navigator.userAgent, subString: "Firefox", identity: "Firefox" }
    { string: navigator.userAgent, subString: "Safari", identity: "Safari" }
    { string: navigator.userAgent, subString: "Opera", identity: "Opera" }
  ]

  compatible: ->
    return Loader.redirect() if Loader.browser == 'Chrome' and Loader.version < 17
    return Loader.redirect() if Loader.browser == 'MSIE' and Loader.version < 10
    return Loader.redirect() if Loader.browser == 'Explorer' and Loader.version < 10
    return Loader.redirect() if Loader.browser == 'FireFox' and Loader.version < 20
    return Loader.redirect() if Loader.browser == 'Safari' and Loader.version < 6
    return Loader.redirect() if !Loader.browser.indexOf ['Chrome','MSIE','FireFox','Safari']
    return true

  redirect: ->
    location.href = '/compatible/'
    return false

  loadscripts: (list, complete) ->
    paths = []
    i = 0
    paths.push Loader.root + folder.replace(/_/g,'/') + '/' + script + '.js' for script in scripts for folder, scripts of list

    floop = (arr) ->
      Loader.load paths[i], false, ->
        if ++i is paths.length then complete() else floop(arr)

    floop paths

  config: (complete) ->
    $.getJSON './cfg/config.json', (result) ->
      window.cfg = result.cfg
      complete()

  load: (script, initiate, complete) ->

    el = document.createElement 'script'
    el.type = 'text/javascript'
    el.src = script
    el.addEventListener 'load' , (e) ->
      complete() if typeof complete is 'function'
      window[initiate].i() if initiate isnt undefined and initiate isnt false
    , false

    document.body.appendChild(el)
