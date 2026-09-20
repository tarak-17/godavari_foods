const express = require("express");

const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/category.controller");

const {
  createCategorySchema,
} = require("../validators/category.validator");

const {
  authenticate,
  authorize,
} = require("../middleware/auth.middleware");

const router = express.Router();

// =====================================
// GET ALL CATEGORIES
// =====================================

router.get("/", getCategories);

// =====================================
// GET CATEGORY BY ID
// =====================================

router.get("/:id", getCategoryById);

// =====================================
// UPDATE CATEGORY
// =====================================

router.patch(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  (req, res, next) => {
    const result = createCategorySchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.issues,
      });
    }

    req.body = result.data;

    next();
  },
  updateCategory
);

// =====================================
// CREATE CATEGORY
// =====================================

router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  (req, res, next) => {
    const result = createCategorySchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.issues,
      });
    }

    req.body = result.data;

    next();
  },
  createCategory
);

// =====================================
// DELETE CATEGORY
// =====================================

router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  deleteCategory
);

// =====================================
// EXPORT ROUTER
// =====================================

module.exports = router;