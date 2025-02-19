const { mongoose, Schema, model } = require("mongoose")

const paymentSchema = new Schema(
    {
        razorpayDetails: {
            orderId: String,
            paymentId: String,
            signature: String,
        },
        success: Boolean,
    },{timestamps: true}
);

const PaymentModel = model("payments",paymentSchema)
module.exports=PaymentModel