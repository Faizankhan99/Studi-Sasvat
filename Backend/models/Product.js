const mongoose = require('mongoose')


const productSchema = new mongoose.Schema({
    productImage: {
        public_id: {
            type: String
        },
        url: {
            type: String
        },
    },
    featuredImages: [{
        public_id: {
            type: String,
            default: null
        },
        url: {
            type: String,
            default: null
        },
    }],
    productName: {
        type: String,
    },
    shortDescription: {
        type: String,
    },
    detailedDescription: {
        type: String,
    },
    price: {
        type: Number,
    },
    discount: {
        type: Number,
    },
    availableQuantity: {
        type: Number,
    },
    freeDelivery: {
        type: Number,
        default: 0
    },
    openBoxDelivery: {
        type: Number,
        default: 0
    },
    deliveryPolicy: {
        type: String,
    },
    returnPolicy: {
        type: String,
    },
    isDeleted: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

var ProductModel = mongoose.model('products',productSchema)
module.exports = ProductModel