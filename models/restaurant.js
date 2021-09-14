const mongoose = require('mongoose');

const schema = mongoose.Schema;

const restaurantSchema = new schema({
    _id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    locality: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    city_name: {
        type: String,
        required: true
    },    
    area: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    thumb: {
        type: String,
        required: true
    },
    thumbs: {
        type: Array,
        required: true
    },
    cost: {
        type: Number,
        required: true
    },
    type: {
        type: Array,
        required: true
    },
    Cuisine: {
        type: Array,
        required: true
    },
    cuisine: {
        type: Array,
        required: true
    }
});

module.exports = mongoose.model('restaurant', restaurantSchema, 'restaurants');
