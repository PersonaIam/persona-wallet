;(function () {
  'use strict'

  /*
   * Opens a link in a new browser tab
   */
  angular.module('personaclient.directives')
    .directive('openExternal', [function () {
      return {
        restrict: 'A',
        require: '?ngModel',
        link: function (scope, element, attrs, ctrl) {
          angular.element(element).bind('click', (event) => {
            const url = scope.$eval(attrs.openExternal)
            require('electron').shell.openExternal(url)
          })
        }
      }
    }])
})()
