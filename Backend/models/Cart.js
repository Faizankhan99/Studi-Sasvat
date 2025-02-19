const mongoose = require('mongoose')


const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserModel",
        required: true,
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductModel",
        required: true,
    },
    quantitySelected: {
        type: Number,
    },
    productImage: {
        public_id: {
            type: String
        },
        url: {
            type: String
        },
    },
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
        type: String,
        default: 0
    },
    openBoxDelivery: {
        type: String,
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

var CartModel = mongoose.model('carts',cartSchema)
module.exports = CartModel