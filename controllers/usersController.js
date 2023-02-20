const User = require('../models/userModel');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')

// @desc Register new user
// @route POST /api/users
// @access PUBLIC

const registerUser = asyncHandler (async (req, res) => {

    const { name, email, password } = req.body
    
    //check if everything is filled in
    if(!name || !email || !password) {
        res.status(400)
        throw new Error("Please fill in all the fields")
    }

    //check if user exists
    const userExists = await User.findOne({ email })
    if (userExists) {
        res.status(400)
        throw new Error('User already exists')
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
        res.status(400)
        throw new Error('Invalid user data')
    }
})

//-----------------------------------------------

// @desc Login a user
// @route POST /api/users/login
// @access PUBLIC

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
  
    const user = await User.findOne({ email })
  
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
        role: user.role
      })
    } else {
      res.status(400)
      throw new Error('Invalid credentials')
    }
  })

//-----------------------------------------------

// @desc Get user data (singulair)
// @route GET /api/users/user
// @access PRIVATE

const getUser = asyncHandler(async (req, res) => {
  res.status(200).json(req.user)
})

//-----------------------------------------------

// @desc Get users data (multiple)
// @route GET /api/users/list
// @access PRIVATE

const getUsers = asyncHandler(async (req, res) => {
    const users = await User.aggregate([
      {
        $lookup: {
          from: "ads",
          localField: "_id",
          foreignField: "user",
          as: "ads"
        }
      },
      {
        $match: { role: 'base' }
      },
      {
        $unset: [
          "password",
          "createdAt",
          "updatedAt",
          "ads.createdAt",
          "ads.updatedAt",
          "ads.__v",
          "__v"
        ]
      }
    ])
  
    res.status(200).json(users)
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
    getUser,
    getUsers
}