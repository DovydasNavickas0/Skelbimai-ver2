const asyncHandler = require('express-async-handler');

const Ad = require('../models/adsModel');

// @desc Get goals / gets the ads that exist
// @route GET /api/goals
// @access PRIVATE

const getAds = asyncHandler(async (req, res) => {
  const ads = await Ad.find({ user: req.user.id })
  res.status(200).json(ads)
})

//-----------------------------------------------

// @desc Creates a ad
// @route POST /api/ads
// @access PRIVATE

const setAd = asyncHandler(async (req, res) => {
    if (!req.body.text || !req.body.description || !req.body.price) {
      res.status(400).send('Please fill in all the required fields')
    }
    const new_ad = await Ad.create({
      text: req.body.text,
      description: req.body.description,
      price: req.body.price,
      user: req.user.id
    })
    res.status(200).json(new_ad)
  })

//-----------------------------------------------

// @desc Update goal/ad with a choosen id
// @route PUT /api/goals/:id
// @access PRIVATE

const updateAd = asyncHandler(async (req, res) => {
    
  const fetched_ad = await Ad.findById(req.params.id)
  
    if (!fetched_ad) {
      res.status(400).send('Ad not found')
    }
  
    // check for user
    if (!req.user) {
      res.status(401).send('User not found')
    }
  
    // make sure the logged in user matches the goal user
    if (fetched_ad.user.toString() !== req.user.id) {
      res.status(401).send('User not authorized')
    }
  
    const updatedAd = await fetched_ad.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    })
    res.status(200).json(updatedAd)
})

//-----------------------------------------------

// @desc Delete goal/ad
// @route DELETE /api/goals/:id
// @access PRIVATE

const deleteAd = asyncHandler(async (req, res) => {
    const ad = await Ad.findById(req.params.id)
  
    if (!ad) {
      res.status(400).send('Ad not found')
    }
  
    // check for user
    if (!req.user) {
      res.status(401).send('User not found')
    }
  
    // make sure the logged in user matches the goal user
    if (ad.user.toString() !== req.user.id) {
      res.status(401).send('User not authorized')
    }
  
    await ad.remove()
  
    res.status(200).json({ id: req.params.id })
})

//-----------------------------------------------

module.exports = {
    getAds,
    setAd,
    updateAd,
    deleteAd
}