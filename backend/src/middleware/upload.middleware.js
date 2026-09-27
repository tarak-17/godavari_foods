const multer = require("multer");

// =====================================
// STORE FILE IN MEMORY
// =====================================

const storage = multer.memoryStorage();

// =====================================
// ALLOWED IMAGE TYPES
// =====================================

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/jpg",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only JPG, JPEG, PNG, and WEBP images are allowed."
      ),
      false
    );
  }
};

// =====================================
// MULTER CONFIGURATION
// =====================================

const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },

  fileFilter,
});

module.exports = upload;