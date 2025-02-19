const pool = require('../db/connectDB')();
const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
    cloud_name: 'depjzfj9a', 
    api_key: '489915939841262', 
    api_secret: '5tBdTUHJ33XMIN3iP-49Rfeps9I',
    // secure: true
});

class CategoryController {

    static store = async (req, res) => {
        try {
            const { 
                categoryName,
            } = req.body;

            const userId = req.user_id;
            const [userData] = await pool.query('SELECT role FROM users WHERE _id = ?', [userId]);

            const [categoryData] = await pool.query('SELECT * FROM categories WHERE categoryName = ?', [categoryName]);
            
            if (categoryData.length == 0 && userData[0].role == 'Admin') {
                let categoryImagePublicId = null;
                let categoryImageUrl = null;

                if (req.files.categoryImage) {
                    const categoryImage = req.files.categoryImage;
                    const uploadResult = await cloudinary.uploader.upload(categoryImage.tempFilePath, {
                        folder: 'studioSasvatImages'
                    });
                    categoryImagePublicId = uploadResult.public_id;
                    categoryImageUrl = uploadResult.secure_url;
                }

                const [dataSaved] = await pool.query('INSERT INTO categories SET ?', {
                    categoryName,  
                    categoryImageUrl,  
                    categoryImagePublicId, 
                });

                if (dataSaved.affectedRows > 0) {
                    res.status(201).json({ 'status': 'success', 'message': 'Category Added Successfully' });
                } else {
                    res.status(401).json({ 'status': 'failed', 'message': 'Internal Server Error' });
                }
            } else {
                res.status(403).json({ 'status': 'failed', 'message': 'Internal Server Error' });
            }
        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

    static fetchAll = async (req, res) => {
        try {
            const [data] = await pool.query(`SELECT * FROM categories ORDER BY _id DESC`);
    
            res.status(200).json({
                success: true,
                data
            });
        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

    static fetchCategoriesWithProducts = async (req, res) => {
        try {
            const [rows] = await pool.query(`
                SELECT 
                    c._id AS categoryId, 
                    c.categoryName, 
                    c.createdAt AS categoryCreatedAt,
                    p._id AS productId, 
                    p.productName, 
                    p.categoryId, 
                    p.subCategoryId, 
                    p.categoryName AS productCategoryName, 
                    p.shortDescription, 
                    p.detailedDescription, 
                    p.price, 
                    p.discount, 
                    p.availableQuantity, 
                    p.quantitySold, 
                    p.freeDelivery, 
                    p.currentRating, 
                    p.openBoxDelivery, 
                    p.returnAndRefund, 
                    p.deliveryPolicy, 
                    p.returnPolicy, 
                    p.productImageUrl, 
                    p.productImagePublicId, 
                    p.isDeleted, 
                    p.createdAt AS productCreatedAt
                FROM categories c
                LEFT JOIN products p ON c._id = p.categoryId
                WHERE c.isDeleted = 0 AND p.isDeleted = 0
                ORDER BY c._id DESC
                LIMIT 12
            `);
    
            const categoryMap = new Map();
    
            rows.forEach(row => {
                if (!categoryMap.has(row.categoryId)) {
                    categoryMap.set(row.categoryId, {
                        _id: row.categoryId,
                        categoryName: row.categoryName,
                        createdAt: row.categoryCreatedAt,
                        products: []
                    });
                }
    
                if (row.productId) {
                    const existingCategory = categoryMap.get(row.categoryId);
                    
                    // Check if the product is already added to the category's products array
                    let productExists = existingCategory.products.some(p => p._id === row.productId);
    
                    if (!productExists) {
                        existingCategory.products.push({
                            _id: row.productId,
                            productName: row.productName,
                            categoryId: row.categoryId,
                            subCategoryId: row.subCategoryId,
                            categoryName: row.productCategoryName,
                            shortDescription: row.shortDescription,
                            detailedDescription: row.detailedDescription,
                            price: row.price,
                            discount: row.discount,
                            availableQuantity: row.availableQuantity,
                            quantitySold: row.quantitySold,
                            freeDelivery: row.freeDelivery,
                            currentRating: row.currentRating,
                            openBoxDelivery: row.openBoxDelivery,
                            returnAndRefund: row.returnAndRefund,
                            deliveryPolicy: row.deliveryPolicy,
                            returnPolicy: row.returnPolicy,
                            productImageUrl: row.productImageUrl,
                            productImagePublicId: row.productImagePublicId,
                            isDeleted: row.isDeleted,
                            createdAt: row.productCreatedAt
                        });
                    }
                }
            });
    
            const categoriesWithProducts = Array.from(categoryMap.values());
    
            res.status(200).json({
                success: true,
                data: categoriesWithProducts
            });
        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

    static fetchSingle = async (req, res) => {
        try {
            const [data] = await pool.query('SELECT * FROM categories WHERE _id = ?', [req.params.id]);
            if (data.length > 0) {
                res.status(200).json({
                    success: true,
                    data: data[0]
                });
            } else {
                res.status(404).json({ 'status': 'failed', 'message': 'Category not found' });
            }
        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

    static update = async (req, res) => {
        try {
            const { 
                categoryName,  
            } = req.body;

            const userId = req.user_id;
            const [userData] = await pool.query('SELECT role FROM users WHERE _id = ?', [userId]);

            if (userData.length > 0 && userData[0].role == 'Admin') {
                const [categoryData] = await pool.query('SELECT * FROM categories WHERE categoryName = ? AND _id != ?', [categoryName, req.params.id]);

                if (categoryData.length == 0) {
                    if (req.files && req.files.categoryImage) {
                        const categoryImage = req.files.categoryImage;
                        const uploadResult = await cloudinary.uploader.upload(categoryImage.tempFilePath, {
                            folder: 'studioSasvatImages'
                        });
                        const categoryImagePublicId = uploadResult.public_id;
                        const categoryImageUrl = uploadResult.secure_url;
        
                        const [oldImage] = await pool.query('SELECT categoryImagePublicId FROM categories WHERE _id = ?', [req.params.id]);
                        if (oldImage.length > 0 && oldImage[0].categoryImagePublicId) {
                            await cloudinary.uploader.destroy(oldImage[0].categoryImagePublicId);
                        }
        
                        await pool.query('UPDATE categories SET ? WHERE _id = ?', [{
                            categoryImagePublicId,  
                            categoryImageUrl
                        }, req.params.id]);
                    }
        
                    const [data] = await pool.query('UPDATE categories SET ? WHERE _id = ?', [{
                        categoryName,
                    }, req.params.id]);
        
                    if (data.affectedRows > 0) {
                        res.status(200).json({ 'status': 'success', 'message': 'Category Updated Successfully' });
                    } else {
                        res.status(500).json({ 'status': 'failed', 'message': 'Internal Server Error' });
                    }
                } else {
                    res.status(500).json({ 'status': 'failed', 'message': 'Category Already Exist' });
                }
            } else {
                res.status(500).json({ 'status': 'failed', 'message': 'Unauthorised' });
            }
        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

    static delete = async (req, res) => {
        try {
            const userId = req.user_id;
            const [userData] = await pool.query('SELECT role FROM users WHERE _id = ?', [userId]);

            if (userData.length > 0 && userData[0].role == 'Admin') {
                const [categoryData] = await pool.query('SELECT isDeleted FROM categories WHERE _id = ?', [req.params.id]);
                if (categoryData.length > 0) {
                    const isDeleted = categoryData[0].isDeleted == 0 ? 1 : 0;
                    const [data] = await pool.query('UPDATE categories SET isDeleted = ? WHERE _id = ?', [isDeleted, req.params.id]);
    
                    if (data.affectedRows > 0) {
                        res.status(200).json({ 'status': 'success', 'message': 'Category Deleted Successfully' });
                    } else {
                        res.status(500).json({ 'status': 'failed', 'message': 'Internal Server Error' });
                    }
                } else {
                    res.status(404).json({ 'status': 'failed', 'message': 'Category not found' });
                }
            } else {
                res.status(500).json({ 'status': 'failed', 'message': 'Unauthorised' });
            }

        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }
}

module.exports = CategoryController;