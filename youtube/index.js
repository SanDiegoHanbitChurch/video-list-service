const YouTube = require('youtube-node')
const { map, curry } = require('ramda')
const youTube = new YouTube()

function connectFn(youtube, apiKey) {
  return new Promise((resolve, reject) => {
    youtube.setKey(apiKey)
    resolve('successfully connected to Youtube')
  })
}

function searchFn(youtube, cache, ttl, channelId) {
  if (foundInCache(cache, ttl, channelId)) {
    return new Promise((resolve) => resolve(cache[channelId].result))
  } else {
    return searchYoutube(youtube, channelId)
  }
}

function foundInCache(cache, ttl, channelId) {
  const currentTime = (new Date()).getTime()
  return cache && cache[channelId] && cache[channelId].retrievedAt < currentTime + ttl
}

function searchYoutube(youtube, channelId) {
  const params = {
    channelId,
    order: 'date'
  }

  return new Promise((resolve, reject) => {
    youtube.search('', 50, params, (error, result) => {
      if (error) {
        console.error('failed to search', error)
        reject(error)
      } else {
        resolve(extract(result))
      }
    })
  })
}

function extract(input) {
  return map((item) => {
    return {
      title: item.snippet.title,
      description: item.snippet.description,
      videoId: item.id.videoId,
      publishedAt: item.snippet.publishedAt
    }
  }, input.items)
}

module.exports = {
  connect: curry(connectFn)(youTube),
  connectFn,
  search: curry(searchFn)(youTube),
  searchFn,
  extract
}
