const YouTube = require('youtube-node')
const { map } = require('ramda')
const youTube = new YouTube()

function connect(apiKey) {
  return new Promise((resolve, reject) => {
    youTube.setKey(apiKey)
    resolve('successfully connected to Youtube')
  })
}

function search(channelId) {
  return new Promise((resolve, reject) => {
    const params = {
      channelId,
      order: 'date'
    }
    youTube.search('', 50, params, (error, result) => {
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
  connect,
  search,
  extract
}
