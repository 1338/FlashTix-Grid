var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var axios = require('axios')
var Twitter = require('twitter')
const port = 3000
require('dotenv').config()

var state = {
  'twitter': {
    'tweets': {},
    'client': false,
    'key': '',
    'secret': '',
    'bearer': false,
    getBearerToken: async () => {
      let twitterBearEndpoint = 'https://api.twitter.com/oauth2/token?grant_type=client_credentials'
      let authToken = Buffer.from(state.twitter.key + ':' + state.twitter.secret).toString('base64')
      let result = axios.post(twitterBearEndpoint, {}, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          'Authorization': 'Basic ' + authToken,
          'Accept-Encoding': 'gzip'
        }
      }).then((res) => {
        return res.data.access_token
      }).catch((err) => {
        console.error(err)
        return false
      })
      return result
    },
    getTwitterClient: async () => {
      if (state.twitter.bearer !== false) {
        return new Twitter({
          consumer_key: state.twitter.key,
          consumer_secret: state.twitter.secret,
          bearer_token: state.twitter.bearer
        })
      }
    }
  }
}

if (process.env.TWITTERKEY != null && process.env.TWITTERSECRET != null) {
  state.twitter.key = process.env.TWITTERKEY
  state.twitter.secret = process.env.TWITTERSECRET
  state.twitter.getBearerToken().then((token) => {
    state.twitter.bearer = token
    console.log('Twitter bearer token: ' + token)
    state.twitter.getTwitterClient().then((client) => {
      state.twitter.client = client
    })
  })
}

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(function (req, res, next) {
  console.log(req.originalUrl)
  next()
}, express.static('public'))

app.post('/twitter', function (req, res) {
  if (req.body && req.body.screen_name) {
    console.log('Looking up latest tweet for: ' + req.body.screen_name)
    if (state.twitter.client !== false) {
      state.twitter.client.get('/statuses/user_timeline.json?tweet_mode=extended&screen_name=' + req.body.screen_name + '&count=1&exclude_replies=true&include_rts=false', function (error, tweets, response) {
        if (error) {
          res.send(error)
        }
        res.send(tweets[0])
      })
    }
  }
})
app.get('/twitter', function (req, res) {
  res.send({ error: 'POST only allowed' })
})

app.listen(port, () => console.log(`Serving FlashTix on port ${port}!`))
