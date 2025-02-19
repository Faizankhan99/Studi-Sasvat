const pool = require('../db/connectDB')();
const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
    cloud_name: 'depjzfj9a', 
    api_key: '489915939841262', 
    api_secret: '5tBdTUHJ33XMIN3iP-49Rfeps9I',
    // secure: true
});

class CouponController {

    static store = async (req, res) => {
        try {
            const { 
                couponName,  
                couponDescription,  
                couponMinimumCartValue,  
                couponPrice,  
                couponPercentage,  
                couponBasedOn,  
                couponValidUpto, 
                couponApplyLimit, 
            } = req.body;

            const userId = req.user_id;

            const [userData] = await pool.query('SELECT role FROM users WHERE _id = ?', [userId]);
            
            if (userData.length > 0 && userData[0].role == 'Admin') {

                const [dataSaved] = await pool.query('INSERT INTO coupons SET ?', {
                    couponName,  
                    couponDescription,  
                    couponMinimumCartValue,  
                    couponPrice,  
                    couponPercentage,  
                    couponBasedOn,  
                    couponValidUpto, 
                    couponApplyLimit, 
                });

                res.status(201).json({ 'status': 'success', 'message': 'Coupon Added Successfully' });
            } else {
                res.status(403).json({ 'status': 'failed', 'message': 'Unauthorized' });
            }
        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

    static fetchAll = async (req, res) => {
        try {
            const searchedRecord = req.headers["searched-record"] || '';
            const pageNumber = Number(req.headers["page-number"]) || 1;
        
            const recordsPerPage = 12;
    
            const fetchRecordTill = recordsPerPage * pageNumber;
            const fetchRecordFrom = fetchRecordTill - recordsPerPage;

            const [allCoupons] = await pool.query(`SELECT * FROM coupons WHERE isDeleted = 0`)
            const totalRecords = allCoupons.length

            if (searchedRecord == '') {
                var [data] = await pool.query(`
                    SELECT * FROM coupons ORDER BY _id DESC LIMIT ? OFFSET ?`, [recordsPerPage, fetchRecordFrom]);
            } else {
                var [data] = await pool.query(`
                    SELECT * FROM coupons WHERE couponName LIKE '%${searchedRecord}%' ORDER BY _id DESC LIMIT ? OFFSET ?`, [recordsPerPage, fetchRecordFrom]);
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

    static fetchAllValid = async (req, res) => {
        try {
            const { data: cartValue } = req.body;
    
            const today = new Date().toISOString().split('T')[0];
    
            const [data] = await pool.query(`
                SELECT * 
                FROM coupons 
                WHERE couponMinimumCartValue <= ? 
                AND couponValidUpto >= ?
            `, [cartValue, today]);
    
            res.status(200).json({
                success: true,
                data
            });
        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

    static validateCoupon = async(req,res) => {
        try {
            const { couponId } = req.body
            const userId = req.user_id

            const [couponData] = await pool.query(`SELECT * FROM coupons WHERE _id = ?`, [couponId])
            const applyLimit = couponData[0].couponApplyLimit

            const [totalOrdersWithThisCoupon] = await pool.query(`SELECT * FROM orders WHERE couponId = ? AND userId = ?` ,[couponId, userId])
            const ordersPlaced = totalOrdersWithThisCoupon?.length

            if (applyLimit == ordersPlaced) {
                res.status(401).json({ 'status': 'failed', 'message': 'Coupon Already Used' });
            } else {
                res.status(201).json({ 'status': 'success', 'message': 'Coupon Used Successfully' });
            }
        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

    static fetchSingle = async (req, res) => {
        try {
            const [data] = await pool.query('SELECT * FROM coupons WHERE _id = ?', [req.params.id]);

            res.status(200).json({
                success: true,
                data: data[0]
            });
        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

    static update = async (req, res) => {
        try {
            const { 
                couponName,  
                couponDescription,  
                couponMinimumCartValue,  
                couponPrice,  
                couponPercentage,  
                couponBasedOn,  
                couponValidUpto,   
                couponApplyLimit,   
            } = req.body;

            const [data] = await pool.query('UPDATE coupons SET ? WHERE _id = ?', [{
                couponName,  
                couponDescription,  
                couponMinimumCartValue,  
                couponPrice,  
                couponPercentage,  
                couponBasedOn,  
                couponValidUpto, 
                couponApplyLimit, 
            }, req.params.id]);

            if (data.affectedRows > 0) {
                res.status(200).json({ 'status': 'success', 'message': 'Coupon Updated Successfully' });
            } else {
                res.status(500).json({ 'status': 'failed', 'message': 'Internal Server Error' });
            }
        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

    static delete = async (req, res) => {
        try {
            const [couponData] = await pool.query('SELECT isDeleted FROM coupons WHERE _id = ?', [req.params.id]);
            if (couponData.length > 0) {
                const isDeleted = couponData[0].isDeleted == 0 ? 1 : 0;
                const [data] = await pool.query('UPDATE coupons SET isDeleted = ? WHERE _id = ?', [isDeleted, req.params.id]);

                if (data.affectedRows > 0) {
                    res.status(200).json({ 'status': 'success', 'message': 'Coupon Deleted Successfully' });
                } else {
                    res.status(500).json({ 'status': 'failed', 'message': 'Internal Server Error' });
                }
            } else {
                res.status(404).json({ 'status': 'failed', 'message': 'Coupon not found' });
            }
        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }
}

module.exports = CouponController;