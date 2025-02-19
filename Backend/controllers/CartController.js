const pool = require('../db/connectDB')();

class CartController {

    static add = async (req, res) => {
        try {
            const id = req.user_id;
            const { 
                productId,
                quantitySelected,
                productName,  
                productImageUrl,   
                price,  
                discount,   
                freeDelivery,  
                openBoxDelivery,   
                returnAndRefund,   
                shippingCharge,   
                cashOnDelivery,   
            } = req.body;

            const [rows] = await pool.query('SELECT * FROM carts WHERE productId = ? AND userId = ?', [productId, id]);

            if (rows.length > 0) {
                res.status(401).json({ 'status': 'failed', 'message': `Product Already Added, Go to Cart` });
            } else {
                const sql = `
                    INSERT INTO carts (userId, productId, quantitySelected, productName, productImageUrl, price, shippingCharge discount, freeDelivery, openBoxDelivery, returnAndRefund, cashOnDelivery)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `;
                const [result] = await pool.query(sql, [id, productId, quantitySelected, productName, productImageUrl, price, shippingCharge, discount, freeDelivery, openBoxDelivery, returnAndRefund, cashOnDelivery]);

                if (result.affectedRows > 0) {
                    res.status(201).json({ 'status': 'success', 'message': `Product Added Successfully` });
                } else {
                    res.status(500).json({ 'status': 'failed', 'message': `Internal Server Error` });
                }
            }
        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

    static update = async (req, res) => {
        try {
            const counterType = req.body.counterType;

            const [rows] = await pool.query('SELECT * FROM carts WHERE _id = ?', [req.params.id]);

            if (rows.length === 0) {
                return res.status(404).json({ 'status': 'failed', 'message': 'Cart item not found' });
            }

            let newQuantity = rows[0].quantitySelected;

            if (counterType === 'increment') {
                newQuantity += 1;
            } else {
                newQuantity -= 1;
            }

            const [productData] = await pool.query('SELECT * FROM products WHERE _id = ?', [rows[0].productId]);

            if (productData.length > 0) {
                const availableQuantity = productData[0].availableQuantity

                if (availableQuantity < newQuantity) {
                    return res.status(404).json({ 'status': 'failed', 'message': 'Product out of stock' });
                } else {
                    const [result] = await pool.query('UPDATE carts SET quantitySelected = ? WHERE _id = ?', [newQuantity, req.params.id]);
        
                    if (result.affectedRows > 0) {
                        res.status(200).json({ 'status': 'success', 'message': `Product Updated Successfully` });
                    } else {
                        res.status(500).json({ 'status': 'failed', 'message': `Internal Server Error` });
                    }
                }
            } else {
                res.status(500).json({ 'status': 'failed', 'message': `Product not found` });
            }
        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

    static remove = async (req, res) => {
        try {
            const [result] = await pool.query('DELETE FROM carts WHERE _id = ?', [req.params.id]);

            if (result.affectedRows > 0) {
                res.status(200).json({ 'status': 'success', 'message': `Product Removed Successfully` });
            } else {
                res.status(500).json({ 'status': 'failed', 'message': `Internal Server Error` });
            }
        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

    static fetchAll = async (req, res) => {
        try {
            const id = req.user_id;

            const [rows] = await pool.query('SELECT * FROM carts WHERE userId = ? ORDER BY _id DESC', [id]);

            res.status(200).json({
                success: true,
                data: rows
            });
        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

}

module.exports = CartController;