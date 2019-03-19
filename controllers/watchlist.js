const express = require('express');
const router = express.Router();

const WatchList = require('../models/watchlist.js');

//Create route
router.post('/', (req, res) => {
  console.log(req.body.coin);
  req.body.coin.createdBy = req.body.currentUser
  WatchList.create(req.body.coin, (err, createdWatchList) => {
    console.log('=======');
    res.json(createdWatchList);
  });
});

//Read route
router.get('/', (req, res) => {
  console.log(req.session.currentUser);
  WatchList.find({createdBy: req.session.currentUser}, (err, foundWatchList) => {
    res.json(foundWatchList);
  });
});

//Update Route
router.put('/:id', (req, res) => {
  WatchList.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, updatedWatchList) => {
    res.json(updatedWatchList);
  });
});

//Delete route
router.delete('/', (req, res) => {
  WatchList.findOneAndDelete(req.params, (err, deletedWatchList) => {
    res.json(deletedWatchList);
  });
});

module.exports = router;
