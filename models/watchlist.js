const mongoose = require('mongoose');

const watchListSchema = new mongoose.Schema({
  name: String,
  symbol: String,
  quote: Object,
  createdBy: String
});

const WatchList = mongoose.model('WatchList', watchListSchema);

module.exports = WatchList;
