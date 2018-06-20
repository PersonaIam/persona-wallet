;(function () {
  'use strict'

  angular.module('personaclient.filters', [])
  angular.module('personaclient.services', ['ngMaterial'])
  angular.module('personaclient.directives', [])
  angular.module('personaclient.accounts', ['ngMaterial', 'personaclient.services', 'personaclient.filters', 'personaclient.addons'])
  angular.module('personaclient.components', ['gettext', 'ngMaterial', 'personaclient.services', 'personaclient.accounts'])
  angular.module('personaclient.addons', [])
  angular.module('personaclient.constants', [])
})()
