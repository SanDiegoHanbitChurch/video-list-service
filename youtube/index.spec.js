const { connectFn, searchFn, extract } = require('./index')
const { spy, stub } = require('sinon')
const youtubeSearchResult = require('./youtube-search-result.json')

const apiKey= 'apiKey'
const channelId = 'channelId'

const expected = [
  {
    title: "\"하나님 나라는 이런 자의 것\" - 정수일 목사",
    description: "누가복음 18장 15절 - 30절.",
    videoId: "WXqopaAect8",
    publishedAt: "2017-07-06T16:42:31.000Z",
  },
  {
    title: "\"의롭다 하심을 받는 성도\" - 정수일 목사",
    description: "누가복음 18장 9절 -14절.",
    videoId: "TE3hfcRAjGY",
    publishedAt: "2017-06-27T02:53:04.000Z",
  },
  {
    title: "\"항상 기도하고\" - 정수일 목사",
    description: "누가복음 18장 1절-8절.",
    videoId: "rrcHpvGmcAg",
    publishedAt: "2017-06-20T12:41:43.000Z",
  },
  {
    title: "\"하나님의 나라는......\" - 정수일 목사",
    description: "누가복음 17장 20절 - 37절.",
    videoId: "yZeZE6GIDvU",
    publishedAt: "2017-06-13T16:36:07.000Z",
  },
  {
    title: "\"관심의 우선순위\" - 정수일 목사",
    description: "누가복음 17장 11절 - 19절.",
    videoId: "dV5pL7f_MMw",
    publishedAt: "2017-06-07T06:16:48.000Z",
  }
]

test('connectFn() should connect to youtube', () => {
  const youtube = {
    setKey: spy()
  }

  connectFn(youtube, apiKey).then((result) => {
    expect(youtube.setKey.calledWith(apiKey)).toEqual(true)
    expect(result).toEqual('successfully connected to Youtube')
  })
})

test('searchFn() should retrieve the list of videos from a channel', () => {
  const youtube = {
    setKey: spy(),
    search: (search, maxNum, params, callback) => {
      callback(null, youtubeSearchResult)
    }
  }

  return searchFn(youtube, channelId).then((result) => {
    expect(result).toEqual(expected)
  }).catch((error) => {
    expect(true).toEqual(false)
  })
})

test.only('searchFn() should use cache if less than ttl', () => {
  const youtube = {
    setKey: spy(),
    search: spy()
  }
  let cache = {
    'channelId': {
      retrievedAt: (new Date()).getTime() + 59,
      result: [{abc: 'xyz'}]
    }
  }
  const ttl = 60

  return searchFn(youtube, cache, ttl, channelId).then((result) => {
    expect(youtube.search.calledOnce).toEqual(false)
    expect(result).toEqual(cache[channelId].result)
  }).catch((error) => {
    expect(true).toEqual(false)
  })

})

test('extract() should build up the video links', () => {
  const youtubeSearchResult = require('./youtube-search-result.json')

  expect(extract(youtubeSearchResult)).toEqual(expected)
})
