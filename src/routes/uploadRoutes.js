const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { uploadOnCloudinary } = require('../utils/cloudinary');

// Upload Endpoint
router.post('/', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ status: 'fail', message: 'No file uploaded' });
        }

        // Upload to Cloudinary
        const cloudinaryResponse = await uploadOnCloudinary(req.file.path);

        if (!cloudinaryResponse) {
            return res.status(500).json({ status: 'error', message: 'Failed to upload to Cloudinary' });
        }

        res.status(200).json({
            status: 'success',
            message: 'File uploaded successfully',
            url: cloudinaryResponse.secure_url,
            response: cloudinaryResponse
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

module.exports = router;
