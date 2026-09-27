const express = require("express");

const upload = require("../middleware/upload.middleware");

const {
  authenticate,
  authorize,
} = require("../middleware/auth.middleware");

const {
  uploadImage,
} = require("../controllers/upload.controller");

const router = express.Router();

// =====================================
// ADMIN IMAGE UPLOAD
// =====================================

router.post(
  "/image",
  authenticate,
  authorize("ADMIN"),
  upload.single("image"),
  uploadImage
);

module.exports = router;