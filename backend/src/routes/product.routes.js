const express = require("express");

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  createProductVariant,
  updateProductVariant,
  deleteProductVariant,
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

// =====================================
// GET ALL PRODUCTS
// PUBLIC
// =====================================

router.get("/", getProducts);

// =====================================
// GET SINGLE PRODUCT
// PUBLIC
// =====================================

router.get("/:id", getProductById);

// =====================================
// CREATE PRODUCT
// ADMIN ONLY
// =====================================

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

// =====================================
// UPDATE PRODUCT
// ADMIN ONLY
// =====================================

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

// =====================================
// DELETE PRODUCT
// ADMIN ONLY
// =====================================

router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  deleteProduct
);

// =====================================
// CREATE PRODUCT VARIANT
// ADMIN ONLY
// =====================================

router.post(
  "/:id/variants",
  authenticate,
  authorize("ADMIN"),
  createProductVariant
);

// =====================================
// UPDATE PRODUCT VARIANT
// ADMIN ONLY
// =====================================

router.patch(
  "/:id/variants/:variantId",
  authenticate,
  authorize("ADMIN"),
  updateProductVariant
);

// =====================================
// DELETE PRODUCT VARIANT
// ADMIN ONLY
// =====================================

router.delete(
  "/:id/variants/:variantId",
  authenticate,
  authorize("ADMIN"),
  deleteProductVariant
);

module.exports = router;