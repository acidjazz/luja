var _;

_ = {
  off: function(el) {
    var i, len;
    i = 0;
    len = arguments.length;
    while (i !== len) {
      if (arguments[i] instanceof jQuery) {
        arguments[i].removeClass("on").addClass("off");
      } else {
        $(arguments[i]).removeClass("on").addClass("off");
      }
      i++;
    }
  },
  on: function(el) {
    var i, len;
    i = 0;
    len = arguments.length;
    while (i !== len) {
      if (arguments[i] instanceof jQuery) {
        arguments[i].removeClass("off").addClass("on");
      } else {
        $(arguments[i]).removeClass("off").addClass("on");
      }
      i++;
    }
  },
  swap: function(el) {
    var i, len;
    i = 0;
    len = arguments.length;
    while (i !== len) {
      if (arguments[i] instanceof jQuery) {
        if (arguments[i].hasClass('off')) {
          _.on(arguments[i]);
        } else {
          _.off(arguments[i]);
        }
      } else {
        if ($(arguments[i]).hasClass('off')) {
          _.on($(arguments[i]));
        } else {
          _.off($(arguments[i]));
        }
      }
      i++;
    }
  },
  encode: function(str) {
    return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');
  },
  t: function(category, action, label, value) {
    return _gaq.push(['_trackEvent', category, action, label, value]);
  },
  rand: function(min, max) {
    return Math.floor(Math.random() * max) + min;
  }
};
