require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser')
const session =  require('express-session')
const cors = require('cors');
const rp = require('request-promise');
const PORT = process.env.PORT || 3000;

//Database
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/the_crypto_sphere'
const API_KEY = process.env.REACT_APP_COIN_API
const NEWS_KEY = process.env.REACT_APP_NEWS_API


const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
  credentials: true
}


//Middleware
app.use(express.json());
app.use(express.static('public'));
app.use(bodyParser.json())
app.use(cors())

app.use(session({
  secret: "mosecret",
  resave: false,
  saveUninitialized: false
}));

//Routes Controllers
const usersController = require('./controllers/users.js');
app.use('/users', cors(), usersController)

const sessionsController = require('./controllers/sessions.js');
app.use('/sessions', sessionsController)

const watchListController = require('./controllers/watchlist.js');
app.use('/watchlist', cors(), watchListController)


//CMC Request
app.get('/cmc', (req, res) => {

  const requestOptions = {
    method: 'GET',
    uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
    qs: {
      start: 1,
      limit: 1000,
      convert: 'USD'
    },
    headers: {
      'X-CMC_PRO_API_KEY': API_KEY
    },
    json: true,
    gzip: true
  };
  rp(requestOptions).then(response => {
    // console.log('API call response:', response);
    res.json({response:response})
  }).catch((err) => {
    console.log('API call error:', err.message);
    res.json({err:err})
  });
})

app.get('/news', (req, res) => {
  const requestNews = {
    method: 'GET',
    uri: 'https://newsapi.org/v2/everything?' + 'q=cryptocurrency&' +
            'sortBy=latest&' + 'apiKey=' + NEWS_KEY,
    json: true,
    gzip: true
  };
  rp(requestNews).then(response => {
    // console.log('API call response:', response);
    res.json({response:response})
  }).catch((err) => {
    console.log('API call error:', err.message);
    res.json({err:err})
  });
})

//Listener
app.listen(PORT, () => {
  console.log(`Awaiting your command, Captain. Listening on port: ${PORT}`);
})

//Mongoose Connection
mongoose.connect(MONGODB_URI, {useNewUrlParser: true});
mongoose.connection.once('open', () => {
  console.log("Mongo is a go!");
})
