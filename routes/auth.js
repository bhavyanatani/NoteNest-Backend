const express = require('express');
const { default: mongoose } = require('mongoose');
const router = express.Router();
const { Schema } = mongoose;
const User = require('../models/Users');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;
const fetchuser = require('../Middleware/fetchuser')

//Route1 : Create a user using: POST "/api/auth/createUser". No login required
router.post('/createUser', [
  body('name', 'Enter a valid name').isLength({ min: 3 }),
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Enter a valid password').isLength({ min: 5 })
], async (req, res) => {
  let success = false;
  const result = validationResult(req);
  //If there are errors return bad request and the error
  if (!result.isEmpty()) {
    return res.status(400).send({success,errors: result.array() });
  }
  //Check whether the user with this email already exists
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({success, error: 'User with this email already exists' });
    }
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);
    //Create a new user
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: secPass
    });
    const data = {
      user: {
        id: user.id
      }
    }
    const authToken = jwt.sign(data, JWT_SECRET);
    success = true;
    res.json({ success,authToken })
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});


//Route2 : Authenticate a user using: POST "/api/auth/login". No login required
router.post('/login', [
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password cannot be blank').exists()
], async (req, res) => {
  let success = false;
  const result = validationResult(req);
  //If there are errors return bad request and the error
  if (!result.isEmpty()) {
    return res.status(400).send({ success,errors: result.array() });
  }
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success,error: "User does not exist!" });
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      return res.status(400).json({ success,error: "Email or Password is incorrect!" });
    }
    const data = {
      user: {
        id: user.id
      }
    }
    const authToken = jwt.sign(data, JWT_SECRET);
    success = true;
    res.json({ success,authToken })

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})

//Route3 : Getting details of logged in user using : POST "/api/auth/getUser". Login required
router.post('/getUser', fetchuser, async (req, res) => {
  try {
    let success = false;
    let userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send(success,"Internal Server Error");
  }
})
module.exports = router