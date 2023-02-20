const mongoose = require('mongoose');

const adSchema = mongoose.model('Ads', new mongoose.Schema({
        user: {
            type: mongoose.Schema.Types.ObjectId,
            require: true,
            ref: 'User'
        },
        text: {
            type: String,
            required: [true, 'Please add a text']
        },
        description: {
            type: String,
            required: [true, 'Please add a description']
        },
        price: {
            type: String, 
            required: [true, 'Please add a price Eur']
        }
    },
    {
        timestamps: true
    }
));

module.exports = adSchema;