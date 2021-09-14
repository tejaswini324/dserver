const mongoose = require('mongoose');
const schema = mongoose.Schema;

const orderSchema = new schema({
    userEmail: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    userAddress: {
        type: String
    },
    orderedItems: {
        type: Array
    },
    orderId: {
        type: String,
        required: true
    },
    transactionData: {
        type: Object
    }
})

module.exports = mongoose.model('order', orderSchema, 'orders');