
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

function getDirectives(){
  evalCode(`
  (function(){
    var app = angular.module('primo-explore');
    var directives = app._invokeQueue.filter(function(d){ return d[1] === 'directive'})
                        .map(function(d){return d[2][0].replace(/([a-z])([A-Z])/g, '$1-$2')
                        .toLowerCase()})
                        .filter(function(d){ return /^prm-/.test(d)});


    var result = [];
    directives = directives.sort();
    directives.forEach(function(directive){
      var t = document.querySelector(directive);
      var directive_exists = false;
      var display = '-';
      if (t) {
        directive_exists = true;
        if (t.style) {
          display = t.style.display;
        }
      }
      result.push({name: directive, display:display, exists:directive_exists})
    });
    return result;
  })();`,function(result){app.directives = result}, function(isException){app.directives = {error: 'oops'}});
}

function debugInfoEnabled(){
  var scope = getScope('prm-search');
  return typeof(scope) == 'undefined' ? false : true;
}

//borrowed from batarang
function getScope(node) {
  var scope = window.angular.element(node).scope();
  if (!scope) {
    // Might be a child of a DocumentFragment...
    while (node && node.nodeType === 1) node = node.parentNode;
    if (node && node.nodeType === 11) node = (node.parentNode || node.host);
    return getScope(node);
  }
  return scope;
}


/*
function getDirectives(){
  app.directives = ["prm-account","prm-account-links","prm-account-overview","prm-action-container","prm-action-list","prm-add-alert-toast","prm-add-query-to-saved-searches","prm-advanced-search","prm-alert-bar","prm-alma-mashup","prm-alma-more-inst","prm-alma-viewit","prm-alma-viewit-items","prm-authentication","prm-back-to-search-results-button","prm-breadcrumbs","prm-brief-result","prm-brief-result-container","prm-change-lang","prm-change-password","prm-citation","prm-citation-trails-indication","prm-citation-trails-indication-container","prm-citation-trails-results-header","prm-collection","prm-collection-breadcrumbs","prm-copy-clipboard-btn","prm-copyright","prm-did-umean","prm-easybib","prm-edit-notification-settings","prm-endnote","prm-explore-main","prm-export-ris","prm-facet","prm-facet-group","prm-favorites","prm-favorites-edit-labels-menu","prm-favorites-labels","prm-favorites-record-labels","prm-favorites-tool-bar","prm-fines","prm-fines-overview","prm-form-field","prm-full-view","prm-full-view-cont","prm-full-view-page","prm-full-view-service-container","prm-highlight","prm-icon","prm-library-card-menu","prm-linked-user-selector","prm-loan","prm-loans","prm-loans-overview","prm-location","prm-location-items","prm-locations","prm-locations-filter","prm-login","prm-login-alma-mashup","prm-login-help","prm-login-item","prm-logo","prm-main-menu","prm-messages-and-blocks","prm-messages-and-blocks-overview","prm-model","prm-no-search-result","prm-opac","prm-opac-back-button","prm-permalink","prm-personal-info","prm-print-item","prm-recomendation-item","prm-recomendations","prm-refworks","prm-request","prm-request-services","prm-requests","prm-requests-overview","prm-requests-services-ovl","prm-saved-queries","prm-saved-queries-list","prm-saved-query-filter","prm-saved-searches-group-actions","prm-search","prm-search-bar","prm-search-bookmark-filter","prm-search-result-availability-line","prm-search-result-frbr-line","prm-search-result-list","prm-search-result-sort-by","prm-search-result-thumbnail-container","prm-send-email","prm-service-button","prm-service-details","prm-service-header","prm-service-links","prm-services-page","prm-skip-to","prm-snippet","prm-spinner","prm-stand-alone-login","prm-static","prm-static-page","prm-tabs-and-scopes-selector","prm-text","prm-topbar","prm-user-area","prm-username-password-login","prm-view-online","prm-virtual-browse","prm-virtual-browse-item","prm-virtual-browse-item-info"];
}
*/
