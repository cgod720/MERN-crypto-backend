const express = require('express');
const router = express.Router();
const User = require('../models/users.js');
const bcrypt = require('bcrypt');

router.post('/', (req, res) => {
  console.log(req.body);
  User.findOne({ username: req.body.username}, (err, foundUser) => {
    if(foundUser){
      res.status(409).json({
        status: 409,
        message: "Username already exists"
      })
    } else if(!req.body.username){
        res.status(401).json({
          status: 401,
          message: 'Error: User name cannot be blank'
        })
    } else if(!req.body.password){
        res.status(401).json({
          status: 401,
          message: 'Error: Password cannot be blank'
        })
    } else {
        req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
        User.create(req.body, (err, createdUser) => {
          res.status(201).json(createdUser)
        }
      );
    }

  })

});

module.exports = router;
