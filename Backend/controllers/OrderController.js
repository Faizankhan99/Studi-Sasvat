const pool = require('../db/connectDB')();
const Razorpay = require('razorpay');
const { createOrder, verifySignature } = require('../utils/RazorPayUtils');
const { refundPayment } = require('../utils/RazorPayUtils');

class OrderController {

    static store = async (req, res) => {
        const connection = await pool.getConnection();
        try {
            // const userId = req.user_id;
    
            const {
                orderId,
                paymentId,
                signature,
                billingAddressName,
                billingAddressEmail,
                billingAddressContactNumber,
                billingAddressAlternateNumber,
                billingAddressPincode,
                billingAddressCity,
                billingAddressState,
                billingAddressCountry,
                billingAddressFullAddress,
                products,
                paymentMode,
                grandTotal,
                couponId,
                couponName,
                couponMinimumCartValue,
                couponPrice,
                couponPercentage,
                couponBasedOn,
                couponValidUpto
            } = req.body;
    
            let paymentStatus = paymentMode === 'Online' ? 'Paid' : 'Yet to Pay';
    
            const [allOrders] = await pool.query('SELECT * FROM orders ORDER BY _id DESC');
            let mandateOrderId = allOrders.length > 0 ? Number(allOrders[0].mandateOrderId) + 1 : 100000001;
    
            await connection.query('START TRANSACTION');
    
            for (let product of products) {
                const {
                    productId,
                    productName,
                    quantitySelected,
                    productImageUrl,
                    price,
                    discount,
                    freeDelivery,
                    openBoxDelivery,
                    returnAndRefund,  
                    shippingCharge,   
                    cashOnDelivery, 
                } = product;
    
                const [productData] = await connection.query('SELECT * FROM products WHERE _id = ?', [productId]);
                
                if (productData.length === 0) {
                    await connection.query('ROLLBACK');
                    return res.status(404).json({ 'status': 'failed', 'message': 'Product not found' });
                }
    
                const currentQuantity = productData[0].availableQuantity;
                const newQuantity = Number(currentQuantity) - Number(quantitySelected);
                const currentSoldQuantity = productData[0].quantitySold
                const newSoldQty = Number(currentSoldQuantity) + Number(quantitySelected)
    
                if (newQuantity < 0) {
                    await connection.query('ROLLBACK');
                    return res.status(400).json({ 'status': 'failed', 'message': 'Insufficient stock for product: ' + productName });
                }
    
                const [dataSaved] = await connection.query('INSERT INTO orders SET ?', {
                    mandateOrderId,
                    orderId,
                    paymentId,
                    signature,
                    userId,
                    billingAddressName,
                    billingAddressEmail,
                    billingAddressContactNumber,
                    billingAddressAlternateNumber,
                    billingAddressPincode,
                    billingAddressCity,
                    billingAddressState,
                    billingAddressCountry,
                    billingAddressFullAddress,
                    productId,
                    productName,
                    quantitySelected,
                    productImageUrl,
                    price,
                    shippingCharge,
                    discount,
                    freeDelivery,
                    openBoxDelivery,
                    returnAndRefund,
                    cashOnDelivery,
                    paymentMode,
                    grandTotal,
                    paymentStatus,
                    couponId,
                    couponName,
                    couponMinimumCartValue,
                    couponPrice,
                    couponPercentage,
                    couponBasedOn,
                    couponValidUpto
                });
    
                if (dataSaved.affectedRows === 0) {
                    await connection.query('ROLLBACK');
                    return res.status(500).json({ 'status': 'failed', 'message': 'Internal Server Error' });
                }
    
                const [updateResult] = await connection.query('UPDATE products SET availableQuantity = ?, quantitySold = ? WHERE _id = ?', [
                    newQuantity,
                    newSoldQty,
                    productId
                ]);
    
                if (updateResult.affectedRows === 0) {
                    await connection.query('ROLLBACK');
                    return res.status(500).json({ 'status': 'failed', 'message': 'Failed to update product quantity' });
                }
            }
    
            await connection.query('DELETE FROM carts WHERE userId = ?', [userId]);
    
            await connection.query('COMMIT');

            const accountSid = 'ACf9e834e4785ab47528169a86c521d1bc';
            const authToken = '6c3ceeff670fb96ab31c8d0f08afd5a0';
            const client = require('twilio')(accountSid, authToken);

            await client.messages
                .create({
                    body: `We’ve received your order and are getting it ready for you. You’ll receive a confirmation and tracking details shortly. Thank you!`,
                    from: 'whatsapp:+14155238886',
                    to: `whatsapp:+91${billingAddressContactNumber}`
                })
                .then(message => console.log(message.sid))

            const adminRole = 'Admin'
            const [adminData] = await connection.query('SELECT * FROM users WHERE role = ?', [adminRole]);

            await client.messages
                .create({
                    body: `Received new order. Check your Administration Panel for more details.`,
                    from: 'whatsapp:+14155238886',
                    to: `whatsapp:+91${adminData[0].mobileNumber}`
                })
                .then(message => console.log(message.sid))

            res.status(201).json({ 'status': 'success', 'message': 'Order Added Successfully and Cart Cleared' });
        } catch (err) {
            await connection.query('ROLLBACK');
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        } finally {
            connection.release();
        }
    }

    static fetchAllOrders = async (req, res) => {
        try {
            
            var [data] = await pool.query(`SELECT * FROM orders ORDER BY orders._id`);    

            res.status(200).json({
                success: true,
                data
            });
        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

    static fetchUserAllOrders = async (req, res) => {
        try {
            
            const [data] = await pool.query(`SELECT *, orders._id AS orderUniqueId FROM orders INNER JOIN users ON orders.userId=users._id WHERE orders.userId = ? ORDER BY orders._id`,[req.params.id]);    

            res.status(200).json({
                success: true,
                data
            });
        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

    static fetchAllUsersOrders = async (req, res) => {
        try {
            const searchedStatus = req.headers["searched-status"] || '';
            const searchedRecord = req.headers["searched-record"] || '';
            const pageNumber = Number(req.headers["page-number"]) || 1;
        
            const recordsPerPage = 12;
    
            const fetchRecordTill = recordsPerPage * pageNumber;
            const fetchRecordFrom = fetchRecordTill - recordsPerPage;

            const [allOrders] = await pool.query(`SELECT * FROM orders`)
            const totalRecords = allOrders.length

            if (searchedStatus == '') {
                if (searchedRecord == '') {
                    var [data] = await pool.query('SELECT *, orders._id AS orderUniqueId FROM orders INNER JOIN users ON orders.userId=users._id ORDER BY orders._id DESC LIMIT ? OFFSET ?', [recordsPerPage, fetchRecordFrom]);
                } else {
                    var [data] = await pool.query(`SELECT *, orders._id AS orderUniqueId FROM orders INNER JOIN users ON orders.userId=users._id WHERE (orders.productName LIKE '%${searchedRecord}%' OR orders.billingAddressName LIKE '%${searchedRecord}%' OR orders.billingAddressContactNumber LIKE '%${searchedRecord}%') ORDER BY orders._id DESC LIMIT ? OFFSET ?`, [recordsPerPage, fetchRecordFrom]);
                }
            } else {
                if (searchedRecord == '') {
                    var [data] = await pool.query(`SELECT *, orders._id AS orderUniqueId FROM orders INNER JOIN users ON orders.userId=users._id WHERE orders.status = '${searchedStatus}' ORDER BY orders._id DESC LIMIT ? OFFSET ?`, [recordsPerPage, fetchRecordFrom]);
                } else {
                    var [data] = await pool.query(`SELECT *, orders._id AS orderUniqueId FROM orders INNER JOIN users ON orders.userId=users._id WHERE (orders.productName LIKE '%${searchedRecord}%' OR orders.billingAddressName LIKE '%${searchedRecord}%' OR orders.billingAddressContactNumber LIKE '%${searchedRecord}%') AND orders.status = '${searchedStatus}' ORDER BY orders._id DESC LIMIT ? OFFSET ?`, [recordsPerPage, fetchRecordFrom]);
                }
            }

            res.status(200).json({
                success: true,
                data,
                totalRecords
            });
        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

    static fetchAll = async (req, res) => {
        try {
            const userId = req.user_id;
            const [data] = await pool.query('SELECT * FROM orders WHERE userId = ? ORDER BY _id DESC', [userId]);

            res.status(200).json({
                success: true,
                data
            });
        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

    static fetchSingle = async (req, res) => {
        try {
            const [data] = await pool.query('SELECT *, orders._id AS orderUniqueId FROM orders INNER JOIN users ON orders.userId=users._id WHERE orders._id = ?', [req.params.id]);

            res.status(200).json({
                success: true,
                data: data[0]
            });
        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

    static updateOrderStatus = async (req, res) => {
        try {
            // status list = Pending, Cancelled, Shipped, Out for Delivery, Delivered, Refund Request, Proceed for Refund, Refund Completed
            const { mandateOrderId, orderStatus, updateAll, id } = req.body;

            const currentDate = new Date().toISOString()
    
            let dataSaved;

            const [orderData] = await pool.query('SELECT * FROM orders WHERE _id = ?', [id]);
            const currentStatus = orderData[0].status

            if (updateAll == 1) {
                if (orderStatus == 'Pending') {
                    if (currentStatus == 'Cancelled') {
                        res.status(404).json({ 'status': 'failed', 'message': `Order Cancelled` });
                    } else {
                        [dataSaved] = await pool.query('UPDATE orders SET status = ?, shipmentDate = ?, outForDeliveryDate = ?, deliveredDate = ?, cancelledDate = ?, refundRequestDate = ?, proceedForRefundDate = ?, refundCompletedDate = ? WHERE mandateOrderId = ?', [orderStatus, null, null, null, null, null, null, null, mandateOrderId]);
                    }
                }
                if (orderStatus == 'Cancelled') {
                    if (currentStatus == 'Pending') {
                        [dataSaved] = await pool.query('UPDATE orders SET status = ?, cancelledDate = ? WHERE _id = ?', [orderStatus, currentDate, id]);
                    } else {
                        res.status(404).json({ 'status': 'failed', 'message': `Order can not be cancelled now, Order can be cancelled before Shipment only, Order Status: ${currentStatus}` });
                    }
                }
                if (orderStatus == 'Shipped') {
                    if (currentStatus == 'Cancelled') {
                        res.status(404).json({ 'status': 'failed', 'message': `Order Cancelled` });
                    } else {
                        [dataSaved] = await pool.query('UPDATE orders SET status = ?, shipmentDate = ?, outForDeliveryDate = ?, deliveredDate = ?, cancelledDate = ?, refundRequestDate = ?, proceedForRefundDate = ?, refundCompletedDate = ? WHERE mandateOrderId = ?', [orderStatus, currentDate, null, null, null, null, null, null, mandateOrderId]);
                    }
                }
                if (orderStatus == 'Out for Delivery') {
                    if (currentStatus == 'Cancelled') {
                        res.status(404).json({ 'status': 'failed', 'message': `Order Cancelled` });
                    } else {
                        [dataSaved] = await pool.query('UPDATE orders SET status = ?, outForDeliveryDate = ?, deliveredDate = ?, cancelledDate = ?, refundRequestDate = ?, proceedForRefundDate = ?, refundCompletedDate = ? WHERE mandateOrderId = ?', [orderStatus, currentDate, null, null, null, null, null, mandateOrderId]);
                    }
                }
                if (orderStatus == 'Delivered') {
                    if (currentStatus == 'Cancelled') {
                        res.status(404).json({ 'status': 'failed', 'message': `Order Cancelled` });
                    } else {
                        [dataSaved] = await pool.query('UPDATE orders SET status = ?, paymentStatus = ?, deliveredDate = ?, cancelledDate = ?, refundRequestDate = ?, proceedForRefundDate = ?, refundCompletedDate = ? WHERE mandateOrderId = ?', [orderStatus, 'Paid', currentDate, null, null, null, null, mandateOrderId]);
                    }
                }
                if (orderStatus == 'Refund Request') {
                    if (currentStatus == 'Cancelled') {
                        res.status(404).json({ 'status': 'failed', 'message': `Order Cancelled` });
                    } else {
                        [dataSaved] = await pool.query('UPDATE orders SET status = ?, refundRequestDate = ?, cancelledDate = ?, proceedForRefundDate = ?, refundCompletedDate = ? WHERE mandateOrderId = ?', [orderStatus, currentDate, null, null, null, mandateOrderId]);
                    }
                }
                if (orderStatus == 'Proceed for Refund') {
                    if (currentStatus == 'Cancelled') {
                        res.status(404).json({ 'status': 'failed', 'message': `Order Cancelled` });
                    } else {
                        [dataSaved] = await pool.query('UPDATE orders SET status = ?, cancelledDate = ?, proceedForRefundDate = ?, refundCompletedDate = ? WHERE mandateOrderId = ?', [orderStatus, null, currentDate, null, mandateOrderId]);
                    }
                }
                if (orderStatus == 'Refund Completed') {
                    [dataSaved] = await pool.query('UPDATE orders SET status = ?, cancelledDate = ?, refundCompletedDate = ? WHERE mandateOrderId = ?', [orderStatus, null, currentDate, mandateOrderId]);
                }
            } else {
                if (orderStatus == 'Pending') {
                    if (currentStatus == 'Cancelled') {
                        res.status(404).json({ 'status': 'failed', 'message': `Order Cancelled` });
                    } else {
                        [dataSaved] = await pool.query('UPDATE orders SET status = ?, shipmentDate = ?, outForDeliveryDate = ?, deliveredDate = ?, cancelledDate = ?, refundRequestDate = ?, proceedForRefundDate = ?, refundCompletedDate = ? WHERE _id = ?', [orderStatus, null, null, null, null, null, null, null, id]);
                    }
                }
                if (orderStatus == 'Cancelled') {
                    if (currentStatus == 'Pending') {
                        const [productData] = await pool.query(`SELECT * FROM products WHERE _id = ?`, [orderData[0].productId]);
                        if (productData.length > 0) {
                            const currentQuantity = productData[0].availableQuantity;
                            const qtyOrdered = orderData[0].quantitySelected
                            const newAvailableQty = Number(currentQuantity) + Number(qtyOrdered);
                            
                            const currentQuantitySold = productData[0].quantitySold;
                            const newSoldQty = Number(currentQuantitySold) - Number(qtyOrdered);

                            await pool.query('UPDATE products SET availableQuantity = ?, quantitySold = ? WHERE _id = ?', [newAvailableQty, newSoldQty, id])
                        }
                        [dataSaved] = await pool.query('UPDATE orders SET status = ?, cancelledDate = ? WHERE _id = ?', [orderStatus, currentDate, id]);
                    } else {
                        res.status(404).json({ 'status': 'failed', 'message': `Order can not be cancelled now, Order can be cancelled before Shipment only, Order Status: ${currentStatus}` });
                    }
                }
                if (orderStatus == 'Shipped') {
                    if (currentStatus == 'Cancelled') {
                        res.status(404).json({ 'status': 'failed', 'message': `Order Cancelled` });
                    } else {
                        [dataSaved] = await pool.query('UPDATE orders SET status = ?, shipmentDate = ?, outForDeliveryDate = ?, deliveredDate = ?, cancelledDate = ?, refundRequestDate = ?, proceedForRefundDate = ?, refundCompletedDate = ? WHERE _id = ?', [orderStatus, currentDate, null, null, null, null, null, null, id]);
                    }
                }
                if (orderStatus == 'Out for Delivery') {
                    if (currentStatus == 'Cancelled') {
                        res.status(404).json({ 'status': 'failed', 'message': `Order Cancelled` });
                    } else {
                        [dataSaved] = await pool.query('UPDATE orders SET status = ?, outForDeliveryDate = ?, deliveredDate = ?, cancelledDate = ?, refundRequestDate = ?, proceedForRefundDate = ?, refundCompletedDate = ? WHERE _id = ?', [orderStatus, currentDate, null, null, null, null, null, id]);
                    }
                }
                if (orderStatus == 'Delivered') {
                    if (currentStatus == 'Cancelled') {
                        res.status(404).json({ 'status': 'failed', 'message': `Order Cancelled` });
                    } else {
                        [dataSaved] = await pool.query('UPDATE orders SET status = ?, paymentStatus = ?, deliveredDate = ?, cancelledDate = ?, refundRequestDate = ?, proceedForRefundDate = ?, refundCompletedDate = ? WHERE _id = ?', [orderStatus, 'Paid', currentDate, null, null, null, null, id]);
                    }
                }
                if (orderStatus == 'Refund Request') {
                    if (currentStatus == 'Cancelled') {
                        res.status(404).json({ 'status': 'failed', 'message': `Order Cancelled` });
                    } else {
                        [dataSaved] = await pool.query('UPDATE orders SET status = ?, refundRequestDate = ?, cancelledDate = ?, proceedForRefundDate = ?, refundCompletedDate = ? WHERE _id = ?', [orderStatus, currentDate, null, null, null, id]);
                    }
                }
                if (orderStatus == 'Proceed for Refund') {
                    if (currentStatus == 'Cancelled') {
                        res.status(404).json({ 'status': 'failed', 'message': `Order Cancelled` });
                    } else {
                        [dataSaved] = await pool.query('UPDATE orders SET status = ?, cancelledDate = ?, proceedForRefundDate = ?, refundCompletedDate = ? WHERE _id = ?', [orderStatus, null, currentDate, null, id]);
                    }
                }
                if (orderStatus == 'Refund Completed') {
                    if (currentStatus == 'Cancelled') {
                        res.status(404).json({ 'status': 'failed', 'message': `Order Cancelled` });
                    } else {
                        const [statusChanged] = await pool.query('UPDATE orders SET status = ?, cancelledDate = ?, refundCompletedDate = ? WHERE _id = ?', [orderStatus, null, currentDate, id]);

                        if (statusChanged.affectedRows > 0) {
                            const [productData] = await pool.query('SELECT * FROM products WHERE _id = ?', [orderData[0].productId]);

                            if (productData.length > 0) {
                                const orderedQuantity = orderData[0].quantitySelected
                                const availableQuantity = productData[0].availableQuantity
                                const updatedQuantity = Number(orderedQuantity) + Number(availableQuantity)

                                if (updatedQuantity) {
                                    [dataSaved] = await pool.query('UPDATE products SET availableQuantity = ? WHERE _id = ?', [updatedQuantity, orderData[0].productId]);
                                } else {
                                    res.status(404).json({ 'status': 'failed', 'message': 'Order Status Updated, Unable to update product available quantity' }); 
                                }
                            } else {
                                res.status(404).json({ 'status': 'failed', 'message': 'Order Status Updated, Unable to update product available quantity' }); 
                            }
                        } else {
                            res.status(404).json({ 'status': 'failed', 'message': 'Order Status Updated, Unable to update product available quantity' });
                        }
                    }
                }
            }
    
            if (dataSaved.affectedRows > 0) {

                const accountSid = 'ACf9e834e4785ab47528169a86c521d1bc';
                const authToken = '6c3ceeff670fb96ab31c8d0f08afd5a0';
                const client = require('twilio')(accountSid, authToken);
    
                client.messages
                    .create({
                        body: `Order Status Update for your product ${orderData[0].productName}, SSID: ${orderData[0].mandateOrderId}, Order Status: ${orderStatus}.`,
                        from: 'whatsapp:+14155238886',
                        to: `whatsapp:+91${orderData[0].billingAddressContactNumber}`
                    })
                    .then(message => console.log(message.sid))

                res.status(200).json({ 'status': 'success', 'message': 'Order status updated successfully' });
            } else {
                res.status(404).json({ 'status': 'failed', 'message': 'Internal Server Error' });
            }
        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

    static orderRefundRequest = async (req,res) => {
        try {
            const { id, orderStatus, upiForRefund, bankAccountHolderNameForRefund, bankAccountNumberForRefund, bankAccountIfscForRefund, bankName, bankBranchName, bankFullAddress, bankCity, bankDistrict, refundAmount } = req.body;

            const currentDate = new Date().toISOString()

            const [orderData] = await pool.query('SELECT * FROM orders WHERE _id = ?', [id]); 

            const [dataSaved] = await pool.query('UPDATE orders SET status = ?, upiForRefund = ?, bankAccountHolderNameForRefund = ?, bankAccountNumberForRefund = ?, bankAccountIfscForRefund = ?, bankName = ?, bankBranchName = ?, bankFullAddress = ?, bankCity = ?, bankDistrict = ?, refundAmount = ?, refundRequestDate = ? WHERE _id = ?', [
                orderStatus, 
                upiForRefund,
                bankAccountHolderNameForRefund, 
                bankAccountNumberForRefund, 
                bankAccountIfscForRefund, 
                bankName, 
                bankBranchName, 
                bankFullAddress, 
                bankCity, 
                bankDistrict, 
                refundAmount, 
                currentDate,
                id
            ]);

            if (dataSaved.affectedRows > 0) {

                const accountSid = 'ACf9e834e4785ab47528169a86c521d1bc';
                const authToken = '6c3ceeff670fb96ab31c8d0f08afd5a0';
                const client = require('twilio')(accountSid, authToken);
    
                client.messages
                    .create({
                        body: `Thank you for reaching out. Your refund request is being processed for the product ${orderData[0].productName}, SSID: ${orderData[0].mandateOrderId} and we’ll update you on the status shortly.`,
                        from: 'whatsapp:+14155238886',
                        to: `whatsapp:+91${orderData[0].billingAddressContactNumber}`
                    })
                    .then(message => console.log(message.sid))

                res.status(200).json({ 'status': 'success', 'message': 'Order refund request sent successfully' });
            } else {
                res.status(404).json({ 'status': 'failed', 'message': 'Internal Server Error' });
            }
        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

    static processRefund = async (req, res) => {
        try {
            // const { paymentId, amount } = req.body;
            const { paymentId, productId } = req.body;

            const razorpay = new Razorpay({
                key_id: process.env.RAZORPAY_KEY_ID,
                key_secret: process.env.RAZORPAY_KEY_SECRET,
            });

            const currentDate = new Date().toISOString()

            const [orderData] = await pool.query('SELECT * FROM orders WHERE _id = ?', [productId]);

            if (orderData.length == 0) {
                res.status(400).json({ 'status': 'failed', 'message': `Error: Internal Server Error` });
            } else {
                const refund = await razorpay.refunds.create({
                    payment_id: paymentId,
                    amount: orderData[0].price * 100,
                    notes: {
                        reason: 'Refund for order cancellation'
                    }
                });

                await pool.query('UPDATE orders SET status = ?, cancelledDate = ?, proceedForRefundDate = ?, refundCompletedDate = ? WHERE _id = ?', ['Proceed for Refund', null, currentDate, null, productId]);
    
                res.status(200).json({
                    success: true,
                    message: 'Refund processed successfully',
                    refund
                });
            }

        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

}

module.exports = OrderController;