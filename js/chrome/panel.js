var app = new Vue({
    el: '#app',
    data: {
        directives: {},
        selectedDirective: '',
        directiveData: {}
    },
    methods: {
        loadDirective: function(directive, event) {
          this.selectedDirective = directive;

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
                function(result){app.directiveData = result},
                function(isException){
                  console.log(isException);
                  app.directiveData = {error: 'Oops'}}
                );
        },
        reloadWithDebugInfo: function() {
            evalCode(`angular.reloadWithDebugInfo()`);
        },
        refreshDirectivesList: function(){
          getDirectives();
        }
    }
});

//load directives list
getDirectives();
