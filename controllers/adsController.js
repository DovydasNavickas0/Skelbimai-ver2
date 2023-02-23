const asyncHandler = require('express-async-handler');

const Ad = require('../models/adsModel');

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

// @desc Get goals / gets the ads that exist
// @route GET /api/goals
// @access PRIVATE

const getAds = asyncHandler(async (req, res) => {
  const ads = await Ad.find({ user: req.user.id })
  res.status(200).json(ads)
})

//-----------------------------------------------


module.exports = {
    setAd,
    getAds
}