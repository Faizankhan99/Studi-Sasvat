const pool = require('../db/connectDB')();
const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
    cloud_name: 'depjzfj9a', 
    api_key: '489915939841262', 
    api_secret: '5tBdTUHJ33XMIN3iP-49Rfeps9I',
    // secure: true
});


class RatingController {

    static storeOrUpdate = async(req,res) => {
        try {
            const userId = req.user_id
            const { productId, rating, review } = req.body
            

            var ratingProductOneImageUrl = null;
            var ratingProductOneImagePublicId = null;
            var ratingProductTwoImageUrl = null;
            var ratingProductTwoImagePublicId = null;
            var ratingProductThreeImageUrl = null;
            var ratingProductThreeImagePublicId = null;
            var ratingProductFourImageUrl = null;
            var ratingProductFourImagePublicId = null;
            var ratingProductFiveImageUrl = null;
            var ratingProductFiveImagePublicId = null;

            if (req.files.ratingProductOneImage) {
                const ratingProductOneImage = req.files.ratingProductOneImage;
                const uploadResult = await cloudinary.uploader.upload(ratingProductOneImage.tempFilePath, {
                    folder: 'studioSasvatImages'
                });
                ratingProductOneImagePublicId = uploadResult.public_id;
                ratingProductOneImageUrl = uploadResult.secure_url;
            }

            if (req.files.ratingProductTwoImage) {
                const ratingProductTwoImage = req.files.ratingProductTwoImage;
                const uploadResult = await cloudinary.uploader.upload(ratingProductTwoImage.tempFilePath, {
                    folder: 'studioSasvatImages'
                });
                ratingProductTwoImagePublicId = uploadResult.public_id;
                ratingProductTwoImageUrl = uploadResult.secure_url;
            }

            if (req.files.ratingProductThreeImage) {
                const ratingProductThreeImage = req.files.ratingProductThreeImage;
                const uploadResult = await cloudinary.uploader.upload(ratingProductThreeImage.tempFilePath, {
                    folder: 'studioSasvatImages'
                });
                ratingProductThreeImagePublicId = uploadResult.public_id;
                ratingProductThreeImageUrl = uploadResult.secure_url;
            }

            if (req.files.ratingProductFourImage) {
                const ratingProductFourImage = req.files.ratingProductFourImage;
                const uploadResult = await cloudinary.uploader.upload(ratingProductFourImage.tempFilePath, {
                    folder: 'studioSasvatImages'
                });
                ratingProductFourImagePublicId = uploadResult.public_id;
                ratingProductFourImageUrl = uploadResult.secure_url;
            }

            if (req.files.ratingProductFiveImage) {
                const ratingProductFiveImage = req.files.ratingProductFiveImage;
                const uploadResult = await cloudinary.uploader.upload(ratingProductFiveImage.tempFilePath, {
                    folder: 'studioSasvatImages'
                });
                ratingProductFiveImagePublicId = uploadResult.public_id;
                ratingProductFiveImageUrl = uploadResult.secure_url;
            }

            const [userData] = await pool.query('SELECT * FROM users WHERE _id = ?', [userId])

            const userName = userData[0].name

            const [isRatingExist] = await pool.query('SELECT * FROM ratings WHERE userId = ? AND productId = ?', [userId, productId])

            if (isRatingExist.length > 0) {
                // update
                var [dataSaved] = await pool.query('UPDATE ratings SET ? WHERE _id = ?', [{
                    rating,
                    review,
                    ratingProductOneImageUrl,
                    ratingProductOneImagePublicId,
                    ratingProductTwoImageUrl,
                    ratingProductTwoImagePublicId,
                    ratingProductThreeImageUrl,
                    ratingProductThreeImagePublicId,
                    ratingProductFourImageUrl,
                    ratingProductFourImagePublicId,
                    ratingProductFiveImageUrl,
                    ratingProductFiveImagePublicId
                }, isRatingExist[0]._id]);
            } else {
                // store
                var [dataSaved] = await pool.query('INSERT INTO ratings SET ?', {
                    productId,
                    userId,
                    userName,
                    rating,
                    review,   
                    ratingProductOneImageUrl,
                    ratingProductOneImagePublicId,
                    ratingProductTwoImageUrl,
                    ratingProductTwoImagePublicId,
                    ratingProductThreeImageUrl,
                    ratingProductThreeImagePublicId,
                    ratingProductFourImageUrl,
                    ratingProductFourImagePublicId,
                    ratingProductFiveImageUrl,
                    ratingProductFiveImagePublicId
                });
            }
            
            if (dataSaved.affectedRows > 0) {
                const [allRatings] = await pool.query('SELECT * FROM ratings WHERE productId = ?', [productId])

                const totalRating = allRatings.reduce((sum, item) => sum + Number(item.rating), 0);
                
                const currentRating = (totalRating / allRatings.length).toFixed(1);

                var [productDataSaved] = await pool.query('UPDATE products SET ? WHERE _id = ?', [{
                    currentRating
                }, productId]);

                if (productDataSaved.affectedRows > 0) {
                    res.status(201).json({ 'status': 'success', 'message': 'Ratings Added Successfully' });
                } else {
                    res.status(401).json({ 'status': 'failed', 'message': 'Internal Server Error' });
                }
            } else {
                res.status(401).json({ 'status': 'failed', 'message': 'Internal Server Error' });
            }
        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

    static fetchAll = async (req, res) => {
        try {
            const [data] = await pool.query('SELECT * FROM ratings ORDER BY _id DESC');
            
            res.status(200).json({
                success: true,
                data
            });
        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

    static fetchSingleProductRating = async (req, res) => {
        try {
            const [data] = await pool.query('SELECT * FROM ratings WHERE productId = ? ORDER BY _id DESC', [req.params.id]);
            
            res.status(200).json({
                success: true,
                data
            });
        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

}
module.exports = RatingController