var app = new Vue({
    el: '#app',
    created: primo.setup(),
    data: {
        directives: {
            list: [],
            filter: '',
            selected: {
                name: '',
                count: 0,
                current: 0,
                scope: {}
            }
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
        pushDirectiveToConsole: function(directive, event) {
            if (directive && directive.name.length > 0) {
                var varName = directive.name.split('-').map((m, i) => {
                    m = m.trim();
                    return i == 0 ? m : m[0].toUpperCase() + m.substr(1)
                }).join('');
                evalCode(`var ${varName}Scope = angular.element(document.querySelectorAll('${directive.name}')[${directive.current -1}]).scope();console.log("Access ${directive} as ${varName}Scope")`)
            }
            event.preventDefault();
        },
        loadDirective: function(directive, index, event) {
            if (index == null || index <= 0) {
              index = 1;
            }

            if (index > directive.count) {
              index = directive.count
            }
            this.directives.selected.name = directive.name;
            this.directives.selected.count = directive.count;
            this.directives.selected.current = index;

            evalCode(`
              (function(){
                var scope = angular.element(document.querySelectorAll('${this.directives.selected.name}')[${this.directives.selected.current - 1}]).scope();

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
            evalCode(`angular.reloadWithDebugInfo()`, function() {
                that.primo.debugInfo = true;
                chrome.runtime.reload();
                primo.setup();
            });
        },
        reloadExtention: function() {
            chrome.runtime.reload();
        },
        refreshDirectivesList: function() {
            //window.respond('Hello from panel');
            primo.getDirectives();
            this.loadDirective(this.directives.selected, 1);
        }
    }
});
