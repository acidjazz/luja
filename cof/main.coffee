_ =

  off: (el) ->
    i = 0
    len = arguments.length

    while i isnt len
      if arguments[i] instanceof jQuery
        arguments[i].removeClass("on").addClass "off"
      else
        $(arguments[i]).removeClass("on").addClass "off"
      i++
    return

  on: (el) ->
    i = 0
    len = arguments.length

    while i isnt len
      if arguments[i] instanceof jQuery
        arguments[i].removeClass("off").addClass "on"
      else
        $(arguments[i]).removeClass("off").addClass "on"
      i++
    return

  swap: (el) ->
    i = 0
    len = arguments.length

    while i isnt len
      if arguments[i] instanceof jQuery
        if arguments[i].hasClass 'off'
          _.on arguments[i]
        else
          _.off arguments[i]
      else
        if $(arguments[i]).hasClass 'off'
          _.on $(arguments[i])
        else
          _.off $(arguments[i])
      i++
    return

  encode: (str) ->
    return encodeURIComponent(str)
      .replace(/!/g, '%21')
      .replace(/'/g, '%27')
      .replace(/\(/g, '%28')
      .replace(/\)/g, '%29')
      .replace(/\*/g, '%2A')
      .replace(/%20/g, '+')

  t: (category, action, label, value) ->
    _gaq.push ['_trackEvent', category, action, label, value]
  rand: (min, max) ->
    return Math.floor(Math.random() * max) + min

  
