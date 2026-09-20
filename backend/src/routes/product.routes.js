const express = require("express");

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");

const {
  createProductSchema,
  updateProductSchema,
} = require("../validators/product.validator");

const {
  authenticate,
  authorize,
} = require("../middleware/auth.middleware");

const router = express.Router();

// GET all products
router.get("/", getProducts);

// GET single product
router.get("/:id", getProductById);

// CREATE product
router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  (req, res, next) => {
    const result = createProductSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.issues,
      });
    }

    req.body = result.data;
    next();
  },
  createProduct
);

// UPDATE product
router.patch(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  (req, res, next) => {
    const result = updateProductSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.issues,
      });
    }

    req.body = result.data;
    next();
  },
  updateProduct
);

// DELETE product
router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  deleteProduct
);

module.exports = router;