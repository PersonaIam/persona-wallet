;(function () {
  'use strict'

  angular.module('personaclient.filters')
    .filter('exchangedate', () => exchangetime => new Date(exchangetime * 1000))
    .filter('amountToCurrency', ['marketService', (marketService) => (amount, scope, bitcoinToggleIsActive) => {
      if (typeof amount === 'undefined' || !amount) return 0
      // NOTE AccountController is being renaming to `ac` in refactored templates
      const ac = scope.ac || scope.ul
      const currencyName = bitcoinToggleIsActive && ac.btcValueActive ? 'prsn-btc' : ac.currency.name
      const market = marketService.getPrice(currencyName)

      const price = market.price
      return (amount * price).toFixed(5)
    }])
    .filter('formatCurrency', () => (val, self, bitcoinToggleIsActive) => {
      const currencyName = bitcoinToggleIsActive && self.btcValueActive ? 'prsn-btc' : self.currency.name
      const languageCode = self.language.replace('_', '-')
      const options = {
        style: 'currency',
        currency: currencyName,
        currencyDisplay: 'symbol'
      }

      let localeVersion

      if (currencyName === 'prsn-btc') {
        let value = String(val).length > 8 ? Number(val).toFixed(8) : val
        localeVersion = ' ' + Number(value)
      } else {
        localeVersion = Number(val).toLocaleString(languageCode, options)
      }

      return localeVersion
    })
    // Converts personaToshi into persona
    .filter('convertToPersonaValue', ['utilityService', utilityService => val => {
      return utilityService.toshiToPersona(val, true)
    }])
    .filter('accountLabel', ['accountService', accountService => address => {
      if (!address) return address

      const username = accountService.getUsername(address)
      return username !== address ? username : smallId(address)
    }])
    .filter('txId', () => txId => txId ? smallId(txId) : txId)

  function smallId (fullId) {
    return fullId.slice(0, 5) + '…' + fullId.slice(-5)
  }
})()
