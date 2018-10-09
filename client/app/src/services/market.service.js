;(function () {
  'use strict'

  angular.module('personaclient.services')
    .service('marketService', ['$q', '$http', 'storageService', 'networkService', MarketService])

  function MarketService ($q, $http, storageService, networkService) {
    const baseUrl = 'https://exchange.coss.io'
    const tickerEndpoint = 'api/ticker'
    const currencies = ['PRSN-BTC']
    const storageKey = 'marketTicker'
    const network = networkService.getNetwork()
    const symbol = 'PRSN'

    const saveTicker = (ticker) => {
      const symbol = ticker.symbol
      const currentMarket = getMarketTicker()

      currentMarket[symbol] = ticker

      storageService.set(storageKey, currentMarket)

      return currentMarket
    }

    const getMarketTicker = () => {
      return storageService.get(storageKey) || {}
    }

    const getPrice = (currency = symbol) => {
      if (!network.cmcTicker && network.token !== symbol) getEmptyMarket()

      const storage = storageService.get(storageKey)
      if (!storage) return getEmptyMarket()
      const market = storage[symbol]

      if (!market) return getEmptyMarket()
      const currencies = market.currencies

      return currencies[currency.toUpperCase()]
    }

    const fetchTicker = () => {
      const deferred = $q.defer()
      const uri = `${baseUrl}/${tickerEndpoint}`
      $http.get(uri, {headers: {'Cache-Control': 'no-cache'}})
        .then(({ data }) => {
          const json = data['prsn-btc']
          if (!json) deferred.reject('Failed to find market price.')
          const currencies = generateRates(json)
          const timestamp = Date.now()
          const result = { symbol, currencies, timestamp }
          deferred.resolve(result)
        })
        .catch(err => deferred.reject(err))
      return deferred.promise
    }

    const updateTicker = async () => {
      const ticker = await fetchTicker()
      return saveTicker(ticker)
    }

    const generateRates = (response) => {
      const rates = {}

      for (const currency of currencies) {
        const market = getEmptyMarket()

        if (response) {
          market.price = response.lastPrice
          market.marketCap = response.MKTCAP || null
          market.volume = response.volume
          market.timestamp = response.LASTUPDATE || 0
          market.change24h = response.change24h || null
        }

        rates[currency] = market
      }

      return rates
    }

    const getEmptyMarket = () => {
      return {
        price: 0.0,
        marketCap: 0.0,
        volume: 0.0,
        timestamp: 0,
        change24h: 0
      }
    }

    return {
      getPrice,
      updateTicker
    }
  }
})()
