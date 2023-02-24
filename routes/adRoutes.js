const express = require('express');
const router = express.Router();

const {
    setAd, getAds, updateAd, deleteAd
} = require('../controllers/adsController');

const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getAds).post(protect, setAd);
router.route('/:id').put(protect, updateAd).delete(protect, deleteAd);

module.exports = router;


// ieva eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZjcwZDkyYjcwMGRkNzk3NjViNTkyZCIsImlhdCI6MTY3NzIyMzM5NCwiZXhwIjoxNjc5ODE1Mzk0fQ.MMJURsrAuv9YZfhEfkqEf1aRAf35fz4PWlEuRcPYIgc

// jonas eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZjcwZDZjYjcwMGRkNzk3NjViNTkyYSIsImlhdCI6MTY3NzIyNTM0NywiZXhwIjoxNjc5ODE3MzQ3fQ.sufK2CgefELtK0adRADZ-up2nn6RKnGKzwKkKYt1ArU