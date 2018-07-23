;(function () {
  'use strict'

  angular.module('personaclient.constants')
    // 1 PERSONA has 100000000 "toshi"
    .constant('PERSONATOSHI_UNIT', Math.pow(10, 8))
    .constant('TRANSACTION_TYPES', {
      'SEND_PERSONA': 0,
      'CREATE_SECOND_PASSPHRASE': 1,
      'CREATE_DELEGATE': 2,
      'VOTE': 3
    })

  angular.module('personaclient.constants')
  // all timestamps start at 2017/3/21 13:00
    .constant('LAUNCH_DATE', new Date(Date.UTC(2017, 2, 21, 13, 0, 0, 0)))
    .constant('LAUNCH_DATE_MAIN', new Date(Date.UTC(2018, 1, 1, 0, 0, 0, 0)))
    .constant('MAIN_NETWORK_VERSION', '55')
})()
