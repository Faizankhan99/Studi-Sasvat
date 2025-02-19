const pool = require('../db/connectDB')();
const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
    cloud_name: 'depjzfj9a', 
    api_key: '489915939841262', 
    api_secret: '5tBdTUHJ33XMIN3iP-49Rfeps9I',
    // secure: true
});

class MainBannerController {

    static store = async (req, res) => {
        try {
            const userId = req.user_id;
            const [userData] = await pool.query('SELECT role FROM users WHERE _id = ?', [userId]);
            
            if (userData.length > 0 && userData[0].role == 'Admin') {
                
                if (req.files.mainBannerImages) {
                    const files = Array.isArray(req.files.mainBannerImages) ? req.files.mainBannerImages : [req.files.mainBannerImages];
                    for (const file of files) {
                        const uploadResult = await cloudinary.uploader.upload(file.tempFilePath, {
                            folder: 'studioSasvatImages/mainBannerImage'
                        });

                        await pool.query('INSERT INTO main_banners SET ?', {
                            mainBannerImagePublicId: uploadResult.public_id,
                            mainBannerImageUrl: uploadResult.secure_url
                        });
                    }
                }

                res.status(201).json({ 'status': 'success', 'message': 'Main Banner Image Added Successfully' });
            } else {
                res.status(403).json({ 'status': 'failed', 'message': 'Internal Server Error' });
            }
        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

    static fetchAll = async (req, res) => {
        try {
            const [data] = await pool.query(`SELECT * FROM main_banners ORDER BY _id DESC`);
    
            res.status(200).json({
                success: true,
                data
            });
        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

    static delete = async (req, res) => {
        try {
            const userId = req.user_id;
            const [userData] = await pool.query('SELECT role FROM users WHERE _id = ?', [userId]);

            if (userData.length > 0 && userData[0].role == 'Admin') {
                const [oldImage] = await pool.query('SELECT * FROM main_banners WHERE _id = ?', [req.params.id]);
                if (oldImage.length > 0 && oldImage[0].mainBannerImagePublicId) {
                    await cloudinary.uploader.destroy(oldImage[0].mainBannerImagePublicId);
                }

                const [data] = await pool.query('DELETE FROM main_banners WHERE _id = ?', [req.params.id]);

                if (data.affectedRows > 0) {
                    res.status(200).json({ 'status': 'success', 'message': 'Main Banner Image Deleted Successfully' });
                } else {
                    res.status(500).json({ 'status': 'failed', 'message': 'Internal Server Error' });
                }
            } else {
                res.status(500).json({ 'status': 'failed', 'message': 'Unauthorised' });
            }

        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }
}

module.exports = MainBannerController;