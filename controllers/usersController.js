const User = require('../models/userModel');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')

// @desc Register new user
// @route POST /api/users
// @access PUBLIC

const registerUser = asyncHandler (async (req, res) => {

    //gets stuff from body
    const { name, email, password } = req.body
    
    //check if everything is filled in
    if(!name || !email || !password) {
        res.status(400).send("Please fill in all the fields")
    }

    //check if user exists
    const userExists = await User.findOne({ email })
    if (userExists) {
        res.status(400).send('User already exists')
    }

    // Hash the pasword
    const salt = await bcrypt.genSalt(10)
    const hashedPasswd = await bcrypt.hash(password, salt)

    //create new user
    const user = await User.create({
        name,
        email,
        password: hashedPasswd,
        role: 'base'
    })

    //uploads to mongodb
    if (user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
            role: user.role
        })
    }
    else {
        res.status(400).send('Invalid user data')
    }
})

//-----------------------------------------------

// @desc Login for a user
// @route POST /api/users/login
// @access PUBLIC

const loginUser = asyncHandler(async (req, res) => {

    //gets stuff from body
    const { email, password } = req.body
  
    const Selectuser = await User.findOne({ email })
  
    //the meat / the thing that fetches the user with that email if passwd is correct
    if (Selectuser && (await bcrypt.compare(password, Selectuser.password))) {
      res.json({
        _id: Selectuser.id,
        name: Selectuser.name,
        email: Selectuser.email,
        token: generateToken(Selectuser._id),
        role: Selectuser.role
      })
    } else {
      res.status(400).send('Invalid credentials')
    }
  })

//-----------------------------------------------

// Generate JWT
const generateToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: '30d'
    })
  }

//-----------------------------------------------


module.exports = {
    registerUser,
    loginUser,
}