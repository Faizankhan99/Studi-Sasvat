const mongoose = require('mongoose')


const wishlistSchema = new mongoose.Schema({
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
    price: {
        type: Number,
    },
    discount: {
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
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

var WishlistModel = mongoose.model('wishlists',wishlistSchema)
module.exports = WishlistModel