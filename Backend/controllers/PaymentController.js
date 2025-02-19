const Razorpay = require('razorpay');
require('dotenv').config();
const { verifySignature, createOrder } = require('../utils/RazorPayUtils');
const pool = require('../db/connectDB')(); // Ensure this is your MySQL connection pool

class PaymentController {
    static initiatePayment = async (req, res) => {
        try {
            const { amount, currency = 'INR' } = req.body;
            const order = await createOrder(amount, currency);
    
            if (!order) return res.status(500).send('Some error occurred');
            res.json(order);
        } catch (error) {
            res.status(500).send(error);
        }
    };
    
    static paymentCallback = async (req, res) => {
        try {
            const {
                orderCreationId,
                razorpayPaymentId,
                razorpayOrderId,
                razorpaySignature,
            } = req.body;
    
            const isVerified = verifySignature(orderCreationId, razorpayPaymentId, razorpaySignature);
    
            if (!isVerified) {
                return res.status(400).json({ msg: 'Transaction not legit!' });
            }
    
            // Insert payment details into MySQL database
            const query = `
                INSERT INTO payments (orderId, paymentId, signature, success)
                VALUES (?, ?, ?, ?)
            `;
            const values = [razorpayOrderId, razorpayPaymentId, razorpaySignature, true];
    
            await pool.query(query, values);
    
            res.json({
                msg: 'success',
                orderId: razorpayOrderId,
                paymentId: razorpayPaymentId,
            });
    
        } catch (error) {
            res.status(500).send(error);
        }
    };
}

module.exports = PaymentController;