const pool = require('../db/connectDB')();
const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
    cloud_name: 'depjzfj9a', 
    api_key: '489915939841262', 
    api_secret: '5tBdTUHJ33XMIN3iP-49Rfeps9I',
    // secure: true
});

class ProductController {

    static store = async (req, res) => {
        try {
            const { 
                productName,  
                categoryId,  
                subCategoryId,  
                shortDescription,  
                detailedDescription,  
                price,  
                discount,  
                availableQuantity,  
                freeDelivery,  
                openBoxDelivery,  
                returnAndRefund,  
                deliveryPolicy,  
                returnPolicy,   
                shippingCharge,   
                cashOnDelivery, 
            } = req.body;

            const userId = req.user_id;

            const [userData] = await pool.query('SELECT role FROM users WHERE _id = ?', [userId]);
            
            if (userData.length > 0 && userData[0].role == 'Admin') {
                let productImagePublicId = null;
                let productImageUrl = null;
                let productVideoPublicId = null;
                let productVideoUrl = null;

                if (req.files.productImage) {
                    const productImage = req.files.productImage;
                    const uploadResult = await cloudinary.uploader.upload(productImage.tempFilePath, {
                        folder: 'studioSasvatImages'
                    });
                    productImagePublicId = uploadResult.public_id;
                    productImageUrl = uploadResult.secure_url;
                }

                if (req.files.productVideo) {
                    const productVideo = req.files.productVideo;
                    const uploadResult = await cloudinary.uploader.upload(productVideo.tempFilePath, {
                        folder: 'studioSasvatVideos',
                        resource_type: 'video'
                    });
                    productVideoPublicId = uploadResult.public_id;
                    productVideoUrl = uploadResult.secure_url;
                }

                const [categoryData] = await pool.query('SELECT * FROM categories WHERE _id = ?', [categoryId]);
                const categoryName = categoryData[0].categoryName
                const [subCategoryData] = await pool.query('SELECT * FROM sub_categories WHERE _id = ?', [subCategoryId]);
                const subCategoryName = subCategoryData[0].subCategoryName

                const [dataSaved] = await pool.query('INSERT INTO products SET ?', {
                    productName, 
                    categoryId,  
                    categoryName,   
                    subCategoryId,  
                    subCategoryName,   
                    shortDescription,  
                    detailedDescription,  
                    price,  
                    shippingCharge,   
                    discount: discount || 0,  
                    availableQuantity,  
                    freeDelivery: freeDelivery || 0,  
                    openBoxDelivery: openBoxDelivery || 0,  
                    returnAndRefund: returnAndRefund || 0,  
                    cashOnDelivery: cashOnDelivery || 0,  
                    deliveryPolicy,  
                    returnPolicy,  
                    productImagePublicId,
                    productImageUrl,
                    productVideoPublicId,
                    productVideoUrl
                });

                const productId = dataSaved.insertId;

                if (req.files.featuredImages) {
                    const files = Array.isArray(req.files.featuredImages) ? req.files.featuredImages : [req.files.featuredImages];
                    for (const file of files) {
                        const uploadResult = await cloudinary.uploader.upload(file.tempFilePath, {
                            folder: 'studioSasvatImages/featured'
                        });

                        await pool.query('INSERT INTO featured_images SET ?', {
                            productId,
                            featuredImagesPublicId: uploadResult.public_id,
                            featuredImagesUrl: uploadResult.secure_url
                        });
                    }
                }

                res.status(201).json({ 'status': 'success', 'message': 'Product Added Successfully' });
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
            const fetchRecordFrom = (pageNumber - 1) * recordsPerPage;
    
            const [allProducts] = await pool.query(`SELECT * FROM products WHERE isDeleted = 0`);
            const totalRecords = allProducts.length;
    
            if (searchedRecord == '') {
                const [productIds] = await pool.query(`
                    WITH paginatedProducts AS (
                        SELECT p._id AS productId
                        FROM products p
                        ORDER BY p._id DESC
                        LIMIT ? OFFSET ?
                    )
                    SELECT productId FROM paginatedProducts
                `, [recordsPerPage, fetchRecordFrom]);
    
                const ids = productIds.map(p => p.productId);
                if (ids.length === 0) {
                    return res.status(200).json({
                        success: true,
                        data: [],
                        totalRecords
                    });
                }
    
                var [rows] = await pool.query(`
                    SELECT 
                        p._id AS productId, 
                        p.productName, 
                        p.categoryId, 
                        p.subCategoryId, 
                        p.categoryName, 
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
                        p.shippingCharge, 
                        p.cashOnDelivery, 
                        p.deliveryPolicy, 
                        p.returnPolicy, 
                        p.productImageUrl, 
                        p.productImagePublicId, 
                        p.productVideoUrl, 
                        p.productVideoPublicId, 
                        p.isDeleted, 
                        p.createdAt, 
                        fi.featuredImagesPublicId, 
                        fi.featuredImagesUrl
                    FROM products p
                    LEFT JOIN featured_images fi ON p._id = fi.productId
                    WHERE p._id IN (?)
                    ORDER BY p._id DESC
                `, [ids]);
    
            } else {
                const [productIds] = await pool.query(`
                    WITH paginatedProducts AS (
                        SELECT p._id AS productId
                        FROM products p
                        AND p.productName LIKE ?
                        ORDER BY p._id DESC
                        LIMIT ? OFFSET ?
                    )
                    SELECT productId FROM paginatedProducts
                `, [`%${searchedRecord}%`, recordsPerPage, fetchRecordFrom]);
    
                const ids = productIds.map(p => p.productId);
                if (ids.length === 0) {
                    return res.status(200).json({
                        success: true,
                        data: [],
                        totalRecords
                    });
                }
    
                var [rows] = await pool.query(`
                    SELECT 
                        p._id AS productId, 
                        p.productName, 
                        p.categoryId, 
                        p.subCategoryId, 
                        p.categoryName, 
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
                        p.shippingCharge, 
                        p.cashOnDelivery, 
                        p.productImageUrl, 
                        p.productImagePublicId, 
                        p.productVideoUrl, 
                        p.productVideoPublicId, 
                        p.isDeleted, 
                        p.createdAt, 
                        fi.featuredImagesPublicId, 
                        fi.featuredImagesUrl
                    FROM products p
                    LEFT JOIN featured_images fi ON p._id = fi.productId
                    WHERE p._id IN (?)
                    ORDER BY p._id DESC
                `, [ids]);
            }
    
            const productsMap = new Map();
    
            rows.forEach(row => {
                if (!productsMap.has(row.productId)) {
                    productsMap.set(row.productId, {
                        _id: row.productId,
                        productName: row.productName,
                        categoryId: row.categoryId,
                        subCategoryId: row.subCategoryId,
                        categoryName: row.categoryName,
                        shortDescription: row.shortDescription,
                        detailedDescription: row.detailedDescription,
                        price: row.price,
                        shippingCharge: row.shippingCharge,
                        cashOnDelivery: row.cashOnDelivery,
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
                        productVideoUrl: row.productVideoUrl,
                        productVideoPublicId: row.productVideoPublicId,
                        isDeleted: row.isDeleted,
                        createdAt: row.createdAt,
                        featuredImage: []
                    });
                }
    
                if (row.featuredImagesUrl) {
                    productsMap.get(row.productId).featuredImage.push({
                        featuredImageUrl: row.featuredImagesUrl,
                        featuredImagePublicId: row.featuredImagesPublicId
                    });
                }
            });
    
            const products = Array.from(productsMap.values());
    
            res.status(200).json({
                success: true,
                data: products,
                totalRecords
            });
        } catch (err) {
            res.status(500).json({ status: 'failed', message: `Error: ${err.message}` });
        }
    }

    static fetchBestSellingProducts = async (req, res) => {
        try {
            const searchedRecord = req.headers["searched-record"] || '';
            const pageNumber = Number(req.headers["page-number"]) || 1;
    
            const recordsPerPage = 12;
            const fetchRecordFrom = (pageNumber - 1) * recordsPerPage;
    
            const [allProducts] = await pool.query(`SELECT * FROM products WHERE isDeleted = 0`);
            const totalRecords = allProducts.length;
    
            if (searchedRecord === '') {
                var [products] = await pool.query(`
                    SELECT p._id AS productId
                    FROM products p
                    WHERE p.isDeleted = 0
                    ORDER BY p.quantitySold DESC
                    LIMIT ? OFFSET ?
                `, [recordsPerPage, fetchRecordFrom]);
    
            } else {
                var [products] = await pool.query(`
                    SELECT p._id AS productId
                    FROM products p
                    WHERE p.isDeleted = 0 AND p.productName LIKE ?
                    ORDER BY p.quantitySold DESC
                    LIMIT ? OFFSET ?
                `, [`%${searchedRecord}%`, recordsPerPage, fetchRecordFrom]);
            }
    
            const productIds = products.map(product => product.productId);
    
            if (productIds.length > 0) {
                var [rows] = await pool.query(`
                    SELECT 
                        p._id AS productId, 
                        p.productName, 
                        p.categoryId, 
                        p.subCategoryId, 
                        p.categoryName, 
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
                        p.shippingCharge, 
                        p.cashOnDelivery, 
                        p.deliveryPolicy, 
                        p.returnPolicy, 
                        p.productImageUrl, 
                        p.productImagePublicId, 
                        p.isDeleted, 
                        p.createdAt, 
                        fi.featuredImagesPublicId, 
                        fi.featuredImagesUrl
                    FROM products p
                    LEFT JOIN featured_images fi ON p._id = fi.productId
                    WHERE p._id IN (?)
                    ORDER BY p.quantitySold DESC
                `, [productIds]);
    
                const productsMap = new Map();
    
                rows.forEach(row => {
                    if (!productsMap.has(row.productId)) {
                        productsMap.set(row.productId, {
                            _id: row.productId,
                            productName: row.productName,
                            categoryId: row.categoryId,
                            subCategoryId: row.subCategoryId,
                            categoryName: row.categoryName,
                            shortDescription: row.shortDescription,
                            detailedDescription: row.detailedDescription,
                            price: row.price,
                            shippingCharge: row.shippingCharge,
                            cashOnDelivery: row.cashOnDelivery,
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
                            createdAt: row.createdAt,
                            featuredImage: []
                        });
                    }
    
                    if (row.featuredImagesUrl) {
                        productsMap.get(row.productId).featuredImage.push({
                            featuredImageUrl: row.featuredImagesUrl,
                            featuredImagePublicId: row.featuredImagesPublicId
                        });
                    }
                });
    
                const productsResult = Array.from(productsMap.values());
    
                res.status(200).json({
                    success: true,
                    data: productsResult,
                    totalRecords
                });
            } else {
                res.status(200).json({
                    success: true,
                    data: [],
                    totalRecords: 0
                });
            }
    
        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }
    
    static fetchCategoryProducts = async (req, res) => {
        try {
            const pageNumber = Number(req.headers["page-number"]) || 1;
            const recordsPerPage = 12;
            const fetchRecordFrom = (pageNumber - 1) * recordsPerPage;
    
            const [allProducts] = await pool.query(`SELECT * FROM products WHERE categoryId = ? AND isDeleted = 0`, [req.params.id]);
            const totalRecords = allProducts.length;
    
            const [products] = await pool.query(`
                SELECT p._id AS productId
                FROM products p
                WHERE p.categoryId = ? AND p.isDeleted = 0
                ORDER BY p._id DESC
                LIMIT ? OFFSET ?
            `, [req.params.id, recordsPerPage, fetchRecordFrom]);
    
            const productIds = products.map(product => product.productId);
    
            if (productIds.length > 0) {
                const [rows] = await pool.query(`
                    SELECT 
                        p._id AS productId, 
                        p.productName, 
                        p.categoryId, 
                        p.subCategoryId, 
                        p.categoryName, 
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
                        p.shippingCharge, 
                        p.cashOnDelivery, 
                        p.deliveryPolicy, 
                        p.returnPolicy, 
                        p.productImageUrl, 
                        p.productImagePublicId, 
                        p.isDeleted, 
                        p.createdAt, 
                        fi.featuredImagesPublicId, 
                        fi.featuredImagesUrl
                    FROM products p
                    LEFT JOIN featured_images fi ON p._id = fi.productId
                    WHERE p._id IN (?)
                    ORDER BY p._id DESC
                `, [productIds]);
    
                const productsMap = new Map();
    
                rows.forEach(row => {
                    if (!productsMap.has(row.productId)) {
                        productsMap.set(row.productId, {
                            _id: row.productId,
                            productName: row.productName,
                            categoryId: row.categoryId,
                            subCategoryId: row.subCategoryId,
                            categoryName: row.categoryName,
                            shortDescription: row.shortDescription,
                            detailedDescription: row.detailedDescription,
                            price: row.price,
                            shippingCharge: row.shippingCharge,
                            cashOnDelivery: row.cashOnDelivery,
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
                            createdAt: row.createdAt,
                            featuredImage: []
                        });
                    }
    
                    if (row.featuredImagesUrl) {
                        productsMap.get(row.productId).featuredImage.push({
                            featuredImageUrl: row.featuredImagesUrl,
                            featuredImagePublicId: row.featuredImagesPublicId
                        });
                    }
                });
    
                const productsResult = Array.from(productsMap.values());
    
                res.status(200).json({
                    success: true,
                    data: productsResult,
                    totalRecords
                });
            } else {
                res.status(200).json({
                    success: true,
                    data: [],
                    totalRecords: 0
                });
            }
    
        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

    static fetchSubCategoryProducts = async (req, res) => {
        try {
            const pageNumber = Number(req.headers["page-number"]) || 1;
            const recordsPerPage = 12;
            const fetchRecordFrom = (pageNumber - 1) * recordsPerPage;
    
            const [allProducts] = await pool.query(`SELECT * FROM products WHERE subCategoryId = ? AND isDeleted = 0`, [req.params.id]);
            const totalRecords = allProducts.length;
    
            const [products] = await pool.query(`
                SELECT p._id AS productId
                FROM products p
                WHERE p.subCategoryId = ? AND p.isDeleted = 0
                ORDER BY p._id DESC
                LIMIT ? OFFSET ?
            `, [req.params.id, recordsPerPage, fetchRecordFrom]);
    
            const productIds = products.map(product => product.productId);
    
            if (productIds.length > 0) {
                const [rows] = await pool.query(`
                    SELECT 
                        p._id AS productId, 
                        p.productName, 
                        p.categoryId, 
                        p.subCategoryId, 
                        p.subCategoryName, 
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
                        p.shippingCharge, 
                        p.cashOnDelivery, 
                        p.deliveryPolicy, 
                        p.returnPolicy, 
                        p.productImageUrl, 
                        p.productImagePublicId, 
                        p.isDeleted, 
                        p.createdAt, 
                        fi.featuredImagesPublicId, 
                        fi.featuredImagesUrl
                    FROM products p
                    LEFT JOIN featured_images fi ON p._id = fi.productId
                    WHERE p._id IN (?)
                    ORDER BY p._id DESC
                `, [productIds]);
    
                const productsMap = new Map();
    
                rows.forEach(row => {
                    if (!productsMap.has(row.productId)) {
                        productsMap.set(row.productId, {
                            _id: row.productId,
                            productName: row.productName,
                            categoryId: row.categoryId,
                            subCategoryId: row.subCategoryId,
                            subCategoryName: row.subCategoryName,
                            shortDescription: row.shortDescription,
                            detailedDescription: row.detailedDescription,
                            price: row.price,
                            shippingCharge: row.shippingCharge,
                            cashOnDelivery: row.cashOnDelivery,
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
                            createdAt: row.createdAt,
                            featuredImage: []
                        });
                    }
    
                    if (row.featuredImagesUrl) {
                        productsMap.get(row.productId).featuredImage.push({
                            featuredImageUrl: row.featuredImagesUrl,
                            featuredImagePublicId: row.featuredImagesPublicId
                        });
                    }
                });
    
                const productsResult = Array.from(productsMap.values());
    
                res.status(200).json({
                    success: true,
                    data: productsResult,
                    totalRecords
                });
            } else {
                res.status(200).json({
                    success: true,
                    data: [],
                    totalRecords: 0
                });
            }
    
        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

    static fetchSingle = async (req, res) => {
        try {
            const [data] = await pool.query('SELECT * FROM products WHERE _id = ?', [req.params.id]);
            if (data.length > 0) {
                const [featuredImages] = await pool.query('SELECT * FROM featured_images WHERE productId = ?', [req.params.id]);
                res.status(200).json({
                    success: true,
                    data: {
                        ...data[0],
                        featuredImages
                    }
                });
            } else {
                res.status(404).json({ 'status': 'failed', 'message': 'Product not found' });
            }
        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

    static update = async (req, res) => {
        try {
            const { 
                productName,  
                categoryId,
                subCategoryId,
                shortDescription,  
                detailedDescription,  
                price,  
                shippingCharge,  
                discount,  
                availableQuantity,  
                freeDelivery,  
                openBoxDelivery,  
                returnAndRefund,  
                cashOnDelivery,  
                deliveryPolicy,  
                returnPolicy,   
            } = req.body;

            if (req.files && req.files.productImage) {
                const productImage = req.files.productImage;
                const uploadResult = await cloudinary.uploader.upload(productImage.tempFilePath, {
                    folder: 'studioSasvatImages'
                });
                const productImagePublicId = uploadResult.public_id;
                const productImageUrl = uploadResult.secure_url;

                const [oldImage] = await pool.query('SELECT productImagePublicId FROM products WHERE _id = ?', [req.params.id]);
                if (oldImage.length > 0 && oldImage[0].productImagePublicId) {
                    await cloudinary.uploader.destroy(oldImage[0].productImagePublicId);
                }

                await pool.query('UPDATE products SET ? WHERE _id = ?', [{
                    productImagePublicId,  
                    productImageUrl
                }, req.params.id]);
            }

            if (req.files && req.files.productVideo) {
                const productVideo = req.files.productVideo;
                const uploadResult = await cloudinary.uploader.upload(productVideo.tempFilePath, {
                    folder: 'studioSasvatVideos',
                    resource_type: 'video'
                });
                const productVideoPublicId = uploadResult.public_id;
                const productVideoUrl = uploadResult.secure_url;
    
                const [oldVideo] = await pool.query('SELECT productVideoPublicId FROM products WHERE _id = ?', [req.params.id]);
                if (oldVideo.length > 0 && oldVideo[0].productVideoPublicId) {
                    await cloudinary.uploader.destroy(oldVideo[0].productVideoPublicId);
                }
    
                await pool.query('UPDATE products SET ? WHERE _id = ?', [{
                    productVideoPublicId,  
                    productVideoUrl
                }, req.params.id]);
            }
            
            if (req.files && req.files.featuredImages) {
                await pool.query('DELETE from featured_images WHERE productId = ?', [req.params.id])

                const files = Array.isArray(req.files.featuredImages) ? req.files.featuredImages : [req.files.featuredImages];
                for (const file of files) {
                    const uploadResult = await cloudinary.uploader.upload(file.tempFilePath, {
                        folder: 'studioSasvatImages/featured'
                    });

                    await pool.query('INSERT INTO featured_images SET ?', {
                        productId: req.params.id,
                        featuredImagesPublicId: uploadResult.public_id,
                        featuredImagesUrl: uploadResult.secure_url
                    });
                }
            }

            const [categoryData] = await pool.query('SELECT * FROM categories WHERE _id = ?', [categoryId]);
            const categoryName = categoryData[0].categoryName
            const [subCategoryData] = await pool.query('SELECT * FROM sub_categories WHERE _id = ?', [subCategoryId]);
            const subCategoryName = subCategoryData[0].subCategoryName

            const [data] = await pool.query('UPDATE products SET ? WHERE _id = ?', [{
                productName,  
                categoryId,  
                categoryName,  
                subCategoryId,  
                subCategoryName,  
                shortDescription,  
                detailedDescription,  
                price,  
                shippingCharge,  
                discount: discount || 0,  
                availableQuantity,  
                freeDelivery: freeDelivery || 0,  
                openBoxDelivery: openBoxDelivery || 0,  
                returnAndRefund: returnAndRefund || 0,  
                cashOnDelivery: cashOnDelivery || 0,  
                deliveryPolicy,  
                returnPolicy
            }, req.params.id]);

            if (data.affectedRows > 0) {
                res.status(200).json({ 'status': 'success', 'message': 'Product Updated Successfully' });
            } else {
                res.status(500).json({ 'status': 'failed', 'message': 'Internal Server Error' });
            }
        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

    static delete = async (req, res) => {
        try {
            const [productData] = await pool.query('SELECT isDeleted FROM products WHERE _id = ?', [req.params.id]);
            if (productData.length > 0) {
                const isDeleted = productData[0].isDeleted == 0 ? 1 : 0;
                const [data] = await pool.query('UPDATE products SET isDeleted = ? WHERE _id = ?', [isDeleted, req.params.id]);

                if (data.affectedRows > 0) {
                    res.status(200).json({ 'status': 'success', 'message': 'Product Deleted Successfully' });
                } else {
                    res.status(500).json({ 'status': 'failed', 'message': 'Internal Server Error' });
                }
            } else {
                res.status(404).json({ 'status': 'failed', 'message': 'Product not found' });
            }
        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }
}

module.exports = ProductController;