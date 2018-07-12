;(function () {
  'use strict'

  angular.module('personaclient.directives')
    .directive('validAmount', ['utilityService', utilityService => {
      return {
        require: 'ngModel',
        link (scope, elem, attrs, ctrl) {
          const val = value => {
            if (typeof value === 'undefined' || value === 0) {
              ctrl.$pristine = true
            }
            let num = Number(utilityService.personaToToshi(value, 0)) // 1.1 = 110000000

            // TODO refactor to avoid the difference between `$scope.x` and `$scope.send.x`

            let totalBalance = scope.send ? scope.send.totalBalance : scope.totalBalance
            totalBalance = Number(utilityService.personaToToshi(totalBalance))

            let remainingBalance = utilityService.toshiToPersona(totalBalance - num, true)
            if (scope.send) {
              scope.send.remainingBalance = remainingBalance
            } else {
              scope.remainingBalance = remainingBalance
            }
            num = Number(num)
            if (num < 0 || num > Number.MAX_SAFE_INTEGER || remainingBalance < 0) {
              ctrl.$setValidity('validAmount', false)
            } else {
              ctrl.$setValidity('validAmount', true)
            }

            return value
          }

          ctrl.$parsers.unshift(val)
          ctrl.$formatters.unshift(val)
        }
      }
    }
    ])
})()
