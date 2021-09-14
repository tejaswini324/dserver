const mongoose = require('mongoose');

const schema = mongoose.Schema;

const locationSchema = new schema({
    name: {
        type: String,
        required: true
    },
    city_id: {
        type: String,
        required: true
    },
    location_id: {
        type: String,
        required: true
    },
    country_name: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('location', locationSchema, 'locations');
