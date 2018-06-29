;(function () {
  'use strict'

  angular.module('personaclient.services')
    .service('timeService', ['$q', '$http', '$interval', TimeService])

  /**
   * TimeService
   * @constructor
   */
  function TimeService ($q, $http) {
    const timeServerUrl = 'http://worldclockapi.com/api/json/utc/now'
    let config = {
      timeout: 2000
    }

    /**
     * Function gets a server timestamp as to not rely on the users local clock.
     * Fallback to users local clock on failure.
     * Always returns success.
     */
    function getTimestamp () {
      const deferred = $q.defer()
      const startTime = new Date().getTime()
      let computedTimestamp = startTime
      $http.get(timeServerUrl, config).then(
        (success) => {
          if (success.data.currentDateTime !== undefined) {
            const timestamp = new Date(success.data.currentDateTime).getTime()
            const endTime = new Date().getTime()
            computedTimestamp = timestamp + (endTime - startTime)
          } else {
            computedTimestamp = new Date().getTime()
          }
        },
        (_error) => {
          // use the system time instead on error
          computedTimestamp = new Date().getTime()
        }
      )
      deferred.resolve(computedTimestamp)
      return deferred.promise
    }

    return {
      getTimestamp: getTimestamp
    }
  }
})()
