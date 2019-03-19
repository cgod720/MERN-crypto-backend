const express = require('express');
const router = express.Router();
const User = require('../models/users.js');
const bcrypt = require('bcrypt');

router.post('/', (req, res) => {
  console.log(req.body);
  User.findOne({username: req.body.username}, (err, foundUser) => {
    console.log(err);
    console.log(foundUser);
    if(!foundUser){
      res.status(409).json({
        status: 409,
        message: 'Invalid Username'
      })
    } else if(bcrypt.compareSync(req.body.password, foundUser.password)){
        console.log('logged in');
        req.session.currentUser = foundUser;
        res.status(201).json(foundUser)
    } else {
        res.status(401).json({
          status: 401,
          message: 'Incorrect Password'
        })
    }
  })
});

router.get('/currentUser', (req, res) => {
  res.status(200).json(req.session.currentUser || false)
});

router.delete('/', (req, res) => {
  req.session.destroy((err) => {
    if(err){
      res.status(500).json({
        status: 500,
        message: 'Unexpected error occurred'
      })
    } else {
        res.status(200).json({
          status: 200,
          message: 'Logged Out!'
        })
    }
  })
});

module.exports = router;
