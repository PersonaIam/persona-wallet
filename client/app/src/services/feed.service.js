;(function () {
  'use strict'

  angular.module('personaclient.services')
    .service('feedService', [FeedService])

  function FeedService () {
    return {
      /**
       * Fetches and parses the RSS of an URL
       */
      fetchAndParse (url) {
        const rssParser = require('rss-parser')

        return new Promise((resolve, reject) => {
          rssParser.parseURL(url, (err, parsed) => {
            err ? reject(err) : resolve(parsed)
          })
        })
      },

      /**
       * Fetches and parses the RSS of medium.com/personablockchain
       */
      fetchBlogEntries () {
        const rssUrl = 'https://medium.com/personablockchain';
        return this.fetchAndParse(rssUrl).then(parsed => parsed.feed.entries)
      }
    }
  }
})()
