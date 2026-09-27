const cloudinary = require("../config/cloudinary");

// =====================================
// UPLOAD IMAGE TO CLOUDINARY
// =====================================

const uploadImage = async (req, res) => {
  try {
    // Make sure a file was received
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select an image.",
      });
    }

    // Convert buffer to base64 data URI
    const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString(
      "base64"
    )}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(
      fileBase64,
      {
        folder: "godavari-foods/products",
        resource_type: "image",
      }
    );

    return res.status(201).json({
      success: true,
      message: "Image uploaded successfully.",
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
      },
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to upload image.",
    });
  }
};

module.exports = {
  uploadImage,
};