const mongoose = require('mongoose')
const schema = mongoose.Schema

const itemSchema = new schema({
    _id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required:true
    },
    description: {
        type: String,
        required:true
    },
    ingridients: {
        type: Array,
        required:true
    },
    restaurantId: {
        type: String,
        required:true
    },
    image: {
        type: String,
        required:true
    },
    qty: {
        type: Number,
    },
    price: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('menuItem', itemSchema, 'menuItems');