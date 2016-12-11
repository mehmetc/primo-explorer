
function evalCode(code, success, fail){
  var default_fail = function(isException){
    console.log('Failed to run code');
  }

  var default_success = function(result){
    console.log('Done running code');
  }

  if (typeof fail === 'undefined') {
    fail = default_fail;
  }


  if (typeof success === 'undefined') {
    success = default_success;
  }


  chrome.devtools.inspectedWindow.eval(code, function(result, isException){
    if (isException) {
      fail(isException);
    } else {
      success(result);
    }
  });
}

var primo = {
  setup: function(){
      this.getDirectives();
      this.debugInfoEnabled();
      this.checkPrimoAvailability();
  },
  checkPrimoAvailability: function() {
    console.log('checkPrimoAvailability');
    evalCode(`(function(){
      if ('undefined' !== typeof(window.angular)) {
        var primoExplore = document.querySelector('primo-explore');
        if (primoExplore != null) {
          return true;
        }
      }
      return false;
    })()`, function(r){app.primo.available = r;}, function(){app.primo.available = false;});
  },
  debugInfoEnabled: function(){
    console.log('debugInfoEnabled');
    evalCode(`(function(){
      return typeof(angular.element(document.querySelector('prm-search')).scope()) == 'undefined' ? false : true;
    })()`, function(r){app.primo.debugInfo = r;}, function(){app.primo.debugInfo = false;});
  },
  getDirectives: function(){
    console.log('getDirectives');
    evalCode(`
    (function(){
      var app = angular.module('primo-explore');
      var directives = app._invokeQueue.filter(function(d){ return d[1] === 'directive'})
                          .map(function(d){return d[2][0].replace(/([a-z])([A-Z])/g, '$1-$2')
                          .toLowerCase()})
                          .filter(function(d){ return /^prm-/.test(d)});

      var afterDirectives = Array.from(document.querySelectorAll('*[parent-ctrl="ctrl"]')).map((m) => m.localName).filter((v, i, a) => a.indexOf(v) === i);
      var result = [];

      directives = directives.concat(afterDirectives).sort();
      directives.forEach(function(directive){
        var t = document.querySelectorAll(directive);
        var directive_exists = false;
        if (t.length > 0) {
          directive_exists = true;
        }
        result.push({name: directive, exists:directive_exists, count: t.length});
      });
      return result;
    })();`,function(result){app.directives.list = result}, function(isException){app.directives.list = {error: 'oops'}});
  }
}

//a=Array.from(document.querySelectorAll('*')).filter((v,i,a) => /^prm-/.test(v.localName))
