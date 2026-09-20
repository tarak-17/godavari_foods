const express = require("express");

const {
    addToCart,
    getCart,
    updateCartItem,
    removeCartItem,
    clearCart
    } = require("../controllers/cart.controller");

const {
  authenticate,
} = require("../middleware/auth.middleware");

const {
    addToCartSchema,
    updateCartItemSchema,
  } = require("../validators/cart.validator");
const router = express.Router();


router.get(
    "/",
    authenticate,
    getCart
  );


router.post(
  "/",
  authenticate,
  (req, res, next) => {
    const result = addToCartSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.issues,
      });
    }

    req.body = result.data;
    next();
  },
  addToCart
);

router.patch(
    "/:id",
    authenticate,
    (req, res, next) => {
      const result = updateCartItemSchema.safeParse(req.body);
  
      if (!result.success) {
        return res.status(400).json({
          message: "Validation failed",
          errors: result.error.issues,
        });
      }
  
      req.body = result.data;
      next();
    },
    updateCartItem
  );

  router.delete(
    "/:id",
    authenticate,
    removeCartItem
  );

  router.delete(
    "/",
    authenticate,
    clearCart
  );


module.exports = router;