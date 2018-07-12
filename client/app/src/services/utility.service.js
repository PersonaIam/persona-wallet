;(function () {
  'use strict'

  angular.module('personaclient.services')
    .service('utilityService', ['PERSONATOSHI_UNIT', 'LAUNCH_DATE', UtilityService])

  // this service should not have any dependencies to other services!
  function UtilityService (PERSONATOSHI_UNIT, LAUNCH_DATE) {
    function toshiToPersona (amount, keepPrecise, numberOfDecimals) {
      if (!amount) {
        return 0
      }

      let persona = amount / PERSONATOSHI_UNIT

      if (!keepPrecise) {
        persona = numberToFixed(persona)
      }

      if (typeof numberOfDecimals !== 'number') {
        return persona
      }

      if (typeof persona === 'number') {
        return persona.toFixed(numberOfDecimals)
      }

      // if we have a string, 'toFixed' won't work, so we use our custom implementation for that
      return numberStringToFixed(persona, numberOfDecimals)
    }

    function personaToToshi (amount, numberOfDecimals) {
      if (!amount) {
        return 0
      }

      const persona = amount * PERSONATOSHI_UNIT
      return typeof numberOfDecimals !== 'number' ? persona : persona.toFixed(numberOfDecimals)
    }

    function numberStringToFixed (persona, numberOfDecimals) {
      if (typeof persona !== 'string' || typeof numberOfDecimals === 'undefined') {
        return persona
      }

      const splitted = persona.split('.')

      if (numberOfDecimals === 0) {
        return splitted[0]
      }

      const decimals = splitted[1] || []
      let newDecimals = ''
      for (let i = 0; i < numberOfDecimals; i++) {
        if (i < decimals.length) {
          newDecimals += decimals[i]
        } else {
          newDecimals += '0'
        }
      }

      return splitted[0] + '.' + newDecimals
    }

    function dateToPersonaStamp (date) {
      if (!date) {
        return null
      }

      date = new Date(date.toUTCString())

      const timestamp = parseInt((date.getTime() - LAUNCH_DATE.getTime()) / 1000)
      return timestamp < 0 ? null : timestamp
    }

    function personaStampToDate (personaRelativeTimeStamp) {
      if (typeof personaRelativeTimeStamp !== 'number' || personaRelativeTimeStamp < 0) {
        return null
      }

      const personaLaunchTime = parseInt(LAUNCH_DATE.getTime() / 1000)

      return new Date((personaRelativeTimeStamp + personaLaunchTime) * 1000)
    }

    function createRefreshState (successMessage, errorMessage) {
      const stateObject = {}

      stateObject.states = []

      stateObject.isRefreshing = false

      stateObject.create = () => {
        const state = { isFinished: false, hasError: false }
        stateObject.states.push(state)
        return state
      }

      stateObject.shouldRefresh = () => {
        if (stateObject.isRefreshing) {
          return false
        }

        stateObject.isRefreshing = true
        return true
      }

      stateObject.updateRefreshState = (toastService) => {
        const areAllFinished = stateObject.states.every(state => state.isFinished)
        const hasAnyError = stateObject.states.some(state => state.hasError)

        if (!areAllFinished) {
          return
        }

        stateObject.isRefreshing = false
        stateObject.states = []

        if (!toastService) {
          return
        }

        if (!hasAnyError) {
          toastService.success(successMessage, 3000)
        } else {
          toastService.error(errorMessage, 3000)
        }
      }

      return stateObject
    }

    function numberToFixed (x) {
      let e
      if (Math.abs(x) < 1.0) {
        e = parseInt(x.toString().split('e-')[1])
        if (e) {
          x *= Math.pow(10, e - 1)
          x = '0.' + (new Array(e)).join('0') + x.toString().substring(2)
        }
      } else {
        e = parseInt(x.toString().split('+')[1])
        if (e > 20) {
          e -= 20
          x /= Math.pow(10, e)
          x += (new Array(e + 1)).join('0')
        }
      }
      return x
    }

    return {
      toshiToPersona: toshiToPersona,
      personaToToshi: personaToToshi,
      numberStringToFixed: numberStringToFixed,

      dateToPersonaStamp: dateToPersonaStamp,
      personaStampToDate: personaStampToDate,

      createRefreshState: createRefreshState
    }
  }
})()
