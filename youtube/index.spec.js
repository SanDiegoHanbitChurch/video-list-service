const { connect, search, extract } = require('./index')

const apiKey= process.env.GOOGLE_APIKEY
const channelId = process.env.YOUTUBE_CHANNEL_ID

test('connect() should connect to youtube', () => {
  connect(apiKey).then((result) => {
    expect(result).toEqual('successfully connected to Youtube')
  })
})

test('search() should retrieve the list of videos from a channel', () => {

  return connect(apiKey).then((result1) => {
    return search(channelId).then((result) => {
      expect(result.length).toEqual(50)
    }).catch((error) => {
      expect(true).toEqual(false)
    })
  })
})

test('extract() should build up the video links', () => {
  const youtubeSearchResult = require('./youtube-search-result.json')

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

  expect(extract(youtubeSearchResult)).toEqual(expected)
})
