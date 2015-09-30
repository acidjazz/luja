var Loader;

Loader = {
  scripts: {
    jst: [],
    jst_lib: [],
    jst_cune: [],
    jst_cune_lib: []
  },
  i: function(callback) {
    this.browser = this.searchString(this.dataBrowser) || "Other";
    this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "Unknown";
    this.mobile = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    this.iPad = /iPad/i.test(navigator.userAgent);
    this.iPhone = /iPhone/i.test(navigator.userAgent);
    this.Chrome = /Chrome/i.test(navigator.userAgent);
    this.Safari = /Safari/i.test(navigator.userAgent) && !Loader.Chrome;
    if (Loader.compatible()) {
      return Loader.loadscripts(Loader.scripts, function() {
        if (window.cfg !== 'undefined') {
          return callback(true);
        } else {
          return Loader.config(function() {
            return callback(true);
          });
        }
      });
    } else {
      return callback(false);
    }
  },
  searchString: function(data) {
    var dataString, i;
    i = 0;
    while (i < data.length) {
      dataString = data[i].string;
      this.versionSearchString = data[i].subString;
      if (dataString.indexOf(data[i].subString) !== -1) {
        return data[i].identity;
      }
      i++;
    }
  },
  searchVersion: function(dataString) {
    var index;
    index = dataString.indexOf(this.versionSearchString);
    if (index === -1) {
      return;
    }
    return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
  },
  dataBrowser: [
    {
      string: navigator.userAgent,
      subString: "Chrome",
      identity: "Chrome"
    }, {
      string: navigator.userAgent,
      subString: "MSIE",
      identity: "Explorer"
    }, {
      string: navigator.userAgent,
      subString: "Firefox",
      identity: "Firefox"
    }, {
      string: navigator.userAgent,
      subString: "Safari",
      identity: "Safari"
    }, {
      string: navigator.userAgent,
      subString: "Opera",
      identity: "Opera"
    }
  ],
  compatible: function() {
    if (Loader.browser === 'Chrome' && Loader.version < 17) {
      return Loader.redirect();
    }
    if (Loader.browser === 'MSIE' && Loader.version < 10) {
      return Loader.redirect();
    }
    if (Loader.browser === 'Explorer' && Loader.version < 10) {
      return Loader.redirect();
    }
    if (Loader.browser === 'FireFox' && Loader.version < 20) {
      return Loader.redirect();
    }
    if (Loader.browser === 'Safari' && Loader.version < 6) {
      return Loader.redirect();
    }
    if (!Loader.browser.indexOf(['Chrome', 'MSIE', 'FireFox', 'Safari'])) {
      return Loader.redirect();
    }
    return true;
  },
  redirect: function() {
    location.href = '/compatible/';
    return false;
  },
  loadscripts: function(list, complete) {
    var floop, folder, i, j, len, paths, script, scripts;
    paths = [];
    i = 0;
    for (folder in list) {
      scripts = list[folder];
      for (j = 0, len = scripts.length; j < len; j++) {
        script = scripts[j];
        paths.push('/' + folder.replace(/_/g, '/') + '/' + script + '.js');
      }
    }
    floop = function(arr) {
      return Loader.load(paths[i], false, function() {
        if (++i === paths.length) {
          return complete();
        } else {
          return floop(arr);
        }
      });
    };
    return floop(paths);
  },
  config: function(complete) {
    return $.getJSON('./cfg/config.json', function(result) {
      window.cfg = result.cfg;
      return complete();
    });
  },
  load: function(script, initiate, complete) {
    var el;
    el = document.createElement('script');
    el.type = 'text/javascript';
    el.src = script;
    el.addEventListener('load', function(e) {
      if (typeof complete === 'function') {
        complete();
      }
      if (initiate !== void 0 && initiate !== false) {
        return window[initiate].i();
      }
    }, false);
    return document.body.appendChild(el);
  }
};
