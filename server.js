var express = require('express')
var app = express()
var bodyParser = require('body-parser')

const port = 3000
/**
var Twitter = require('twitter')

var client = new Twitter({
  consumer_key: '',
  consumer_secret: '',
  access_token_key: '',
  access_token_secret: ''
})
**/
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(function (req, res, next) {
  console.log(req.originalUrl)
  next()
}, express.static('public'))

app.post('/twitter', function (req, res) {
  if (req.body && req.body.screen_name) {
    console.log('Looking up latest tweet for: ' + req.body.screen_name)
    res.send(req.body.screen_name)
    /**
    client.get(`statuses/user_timeline.json?screen_name=${req.body.screen_name}&count=1`, function (error, tweets, response) {
      if (!error) {
        res.send(tweets)
      }
    })
		**/
  }
})
app.get('/twitter', function (req, res) {
  res.send({ error: 'POST only allowed' })
})

app.listen(port, () => console.log(`Serving FlashTix on port ${port}!`))
