var app = new Vue({
    el: '#app',
    created: primo.setup(),
    data: {
        directives:{
          list: [],
          filter:'',
          selected:{name: '',
                    scope: {}}
        },
        primo: {
          available: false,
          debugInfo: false
        }
    },
    methods: {
        filteredDirectives: function(search) {
            if (this.directives && this.directives.list) {
                regexp = new RegExp(search);
                return this.directives.list.filter(item => regexp.test(item.name) || regexp.test(item.exists));
            }
        },
        pushDirectiveToConsole: function(directive, event){
          if (directive && directive.length > 0){
            var varName = directive.split('-').map((m, i) => { m = m.trim();return i == 0 ? m :  m[0].toUpperCase() + m.substr(1)}).join('');
            evalCode(`var ${varName}Scope = angular.element(document.querySelector('${directive}')).scope();console.log("Access ${directive} as ${varName}")`)
          }
        },
        loadDirective: function(directive, event) {
            this.directives.selected.name = directive;

            evalCode(`
              (function(){
                var scope = angular.element(document.querySelector('${directive}')).scope();

                if (scope) {
                  var rawController = scope.ctrl;
                  var controller = {};

                  for (var prop in rawController) {
                    if (!rawController.hasOwnProperty(prop)){
                      continue;
                    }

                    switch (typeof(rawController[prop])) {
                      case 'string':
                        controller[prop] = '"' + rawController[prop] + '"';
                        break;
                      case 'boolean':
                        controller[prop] = rawController[prop];
                        break;
                      default:
                        if (rawController[prop] == undefined) {
                          controller[prop] = "Undefined";
                        } else {
                          try {
                              controller[prop] = rawController[prop].constructor.name;
                          } catch (e){
                            controller[prop] = typeof(rawController[prop]);
                          }
                        }

                    }
                  }

                  return controller;
                } else {
                  return {};
                }
              })()`,
                function(result) {
                    app.directives.selected.scope = result
                },
                function(isException) {
                    console.log(isException);
                    app.directives.selected.scope = {
                        error: 'Oops'
                    }
                }
            );
        },
        reloadWithDebugInfo: function(event) {
          var that = this;
          event.preventDefault();
          evalCode(`angular.reloadWithDebugInfo()`, function(){
            that.primo.debugInfo = true;
            //window.location.reload();
            chrome.runtime.reload();
            primo.setup();
          });
        },
        reloadExtention: function(){
          chrome.runtime.reload();
        },
        refreshDirectivesList: function() {
            primo.getDirectives();
        }
    }
});
