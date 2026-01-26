const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadToCloudinary = async (file) => {
  try {
    // Use the tempFilePath that express-fileupload creates
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: 'auditorium-pdfs',
      resource_type: 'auto',
      public_id: `pdf-${Date.now()}`, // Generate unique name
      format: 'pdf'
    });

    console.log("Upload result:", result);
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

module.exports = { uploadToCloudinary }; 