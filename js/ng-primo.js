var ngPrimo = {
    isAvailable: function() {
        return 'undefined' !== typeof this.app ? true : false;
    },
    hasAngular: function() {
        return 'undefined' !== typeof window.angular ? true : false;
    },
    get app() {
        var that = this;

        function _getInstance() {
            if (!that._app) {
                console.log('creating');
                try {
                    if (that.hasAngular()) {
                        that._app = window.angular.module('primo-explore');
                    }
                } catch (error) {
                    that._app = undefined;
                }
            }

            return that._app;
        }
        return _getInstance();
    },
    get directives() {
        var directives = this.app._invokeQueue.filter(function(d) {
                return d[1] === 'directive'
            })
            .map(function(d) {
                return d[2][0].replace(/([a-z])([A-Z])/g, '$1-$2')
                    .toLowerCase()
            })
            .filter(function(d) {
                return /^prm-/.test(d)
            });
        directives = directives.sort();
        return directives;
    },
    directiveExists: function(directive){
      var d = document.querySelector(directive);
      return (d && typeof(d)) != 'undefined' ? true : false;
    }
  };
