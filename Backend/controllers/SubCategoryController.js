const pool = require('../db/connectDB')();
const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
    cloud_name: 'depjzfj9a', 
    api_key: '489915939841262', 
    api_secret: '5tBdTUHJ33XMIN3iP-49Rfeps9I',
    // secure: true
});

class SubCategoryController {

    static store = async (req, res) => {
        try {
            const { 
                categoryId,
                subCategoryName,
            } = req.body;

            const userId = req.user_id;
            const [userData] = await pool.query('SELECT role FROM users WHERE _id = ?', [userId]);

            const [subCategoryData] = await pool.query('SELECT * FROM sub_categories WHERE subCategoryName = ?', [subCategoryName]);

            if (subCategoryData.length == 0 && userData[0].role == 'Admin') {
                let subCategoryImagePublicId = null;
                let subCategoryImageUrl = null;

                if (req.files.subCategoryImage) {
                    const subCategoryImage = req.files.subCategoryImage;
                    const uploadResult = await cloudinary.uploader.upload(subCategoryImage.tempFilePath, {
                        folder: 'studioSasvatImages'
                    });
                    subCategoryImagePublicId = uploadResult.public_id;
                    subCategoryImageUrl = uploadResult.secure_url;
                }

                const [categoryData] = await pool.query('SELECT * FROM categories WHERE _id = ?', [categoryId]);
                const categoryName = categoryData[0].categoryName

                const [dataSaved] = await pool.query('INSERT INTO sub_categories SET ?', {
                    categoryId,  
                    categoryName,  
                    subCategoryName,  
                    subCategoryImageUrl,  
                    subCategoryImagePublicId, 
                });

                if (dataSaved.affectedRows > 0) {
                    res.status(201).json({ 'status': 'success', 'message': 'Sub Category Added Successfully' });
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
            const [data] = await pool.query(`SELECT * FROM sub_categories ORDER BY _id DESC`);
    
            res.status(200).json({
                success: true,
                data
            });
        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

    static fetchbyCategoryId = async (req, res) => {
        try {
            const [data] = await pool.query(`SELECT * FROM sub_categories WHERE categoryId = ? ORDER BY _id DESC`, [req.params.id]);
    
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
            const [data] = await pool.query('SELECT * FROM sub_categories WHERE _id = ?', [req.params.id]);
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
                categoryId,
                subCategoryName,
            } = req.body;

            const userId = req.user_id;
            const [userData] = await pool.query('SELECT role FROM users WHERE _id = ?', [userId]);

            const [subCategoryData] = await pool.query('SELECT * FROM sub_categories WHERE subCategoryName = ? AND _id != ?', [subCategoryName, req.params.id]);
            const [categoryData] = await pool.query('SELECT * FROM categories WHERE _id = ?', [categoryId]);
            const categoryName = categoryData[0].categoryName

            if (userData.length > 0 && userData[0].role == 'Admin') {
                if (subCategoryData.length == 0) {
                    if (req.files && req.files.subCategoryImage) {
                        const subCategoryImage = req.files.subCategoryImage;
                        const uploadResult = await cloudinary.uploader.upload(subCategoryImage.tempFilePath, {
                            folder: 'studioSasvatImages'
                        });
                        const subCategoryImagePublicId = uploadResult.public_id;
                        const subCategoryImageUrl = uploadResult.secure_url;
        
                        const [oldImage] = await pool.query('SELECT subCategoryImagePublicId FROM sub_categories WHERE _id = ?', [req.params.id]);
                        if (oldImage.length > 0 && oldImage[0].subCategoryImagePublicId) {
                            await cloudinary.uploader.destroy(oldImage[0].subCategoryImagePublicId);
                        }
        
                        await pool.query('UPDATE categories SET ? WHERE _id = ?', [{
                            subCategoryImagePublicId,  
                            subCategoryImageUrl
                        }, req.params.id]);
                    }
        
                    const [data] = await pool.query('UPDATE sub_categories SET ? WHERE _id = ?', [{
                        categoryId,
                        categoryName,
                        subCategoryName,
                    }, req.params.id]);
        
                    if (data.affectedRows > 0) {
                        res.status(200).json({ 'status': 'success', 'message': 'Sub Category Updated Successfully' });
                    } else {
                        res.status(500).json({ 'status': 'failed', 'message': 'Internal Server Error' });
                    }
                } else {
                    res.status(500).json({ 'status': 'failed', 'message': 'Sub Category Already Exist' });
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
                const [subCategoryData] = await pool.query('SELECT isDeleted FROM sub_categories WHERE _id = ?', [req.params.id]);
                if (subCategoryData.length > 0) {
                    const isDeleted = subCategoryData[0].isDeleted == 0 ? 1 : 0;
                    const [data] = await pool.query('UPDATE sub_categories SET isDeleted = ? WHERE _id = ?', [isDeleted, req.params.id]);
    
                    if (data.affectedRows > 0) {
                        res.status(200).json({ 'status': 'success', 'message': 'Sub Category Deleted Successfully' });
                    } else {
                        res.status(500).json({ 'status': 'failed', 'message': 'Internal Server Error' });
                    }
                } else {
                    res.status(404).json({ 'status': 'failed', 'message': 'Sub Category not found' });
                }
            } else {
                res.status(500).json({ 'status': 'failed', 'message': 'Unauthorised' });
            }

        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }
}

module.exports = SubCategoryController;