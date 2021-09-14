const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userSchema = new schema({
    name: {
        type: String
    },
    email: {
        type: String,
        required:true
    },
    password: {
        type: String,
        required:true
    },
    phone: {
        type: Number
    },
    address: {
        type: String
    },
    resetToken: String,
    expireToken: Date
})

module.exports = mongoose.model('user', userSchema, 'users');