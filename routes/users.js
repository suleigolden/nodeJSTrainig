const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Bring in User Model
let User = require('../models/user');

// Register Form
router.get('/register', (req, res)=>{
  let errors = {};
  res.render('register', {errors:errors});
});

module.exports = router;
