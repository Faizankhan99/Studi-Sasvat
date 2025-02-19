const pool = require('../db/connectDB')();

class WishlistController {

    static addOrRemove = async (req, res) => {
        try {
            const userId = req.user_id;
    
            const {
                productId,
                productName,
                productImageUrl,
                price,
                discount,
                freeDelivery,
                openBoxDelivery,
                returnAndRefund,
            } = req.body;
    
            const [isAlreadyExist] = await pool.query('SELECT * FROM wishlists WHERE productId = ? AND userId = ?', [productId, userId]);
    
            if (isAlreadyExist.length > 0) {
                const [dataSaved] = await pool.query('DELETE FROM wishlists WHERE _id = ?', [isAlreadyExist[0]._id]);
                
                if (dataSaved.affectedRows > 0) {
                    res.status(201).json({ 'status': 'success', 'message': 'Product Removed Successfully' });
                } else {
                    res.status(500).json({ 'status': 'failed', 'message': 'Internal Server Error' });
                }
            } else {
                const [dataSaved] = await pool.query('INSERT INTO wishlists SET ?', {
                    userId,
                    productId,
                    productName,
                    price,
                    discount,
                    freeDelivery,
                    openBoxDelivery,
                    returnAndRefund,
                    productImageUrl,
                });
    
                if (dataSaved.affectedRows > 0) {
                    res.status(201).json({ 'status': 'success', 'message': 'Product Added Successfully' });
                } else {
                    res.status(500).json({ 'status': 'failed', 'message': 'Internal Server Error' });
                }
            }
        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

    static fetchAll = async (req, res) => {
        try {
            const userId = req.user_id;
            const [data] = await pool.query('SELECT * FROM wishlists INNER JOIN products ON wishlists.productId=products._id WHERE wishlists.userId = ? ORDER BY wishlists._id DESC', [userId]);

            res.status(200).json({
                success: true,
                data
            });
        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

}

module.exports = WishlistController;