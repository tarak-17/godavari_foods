const express = require("express");

const {
    createOrder,
    getOrders,
    getOrderById,
  } = require("../controllers/order.controller");

const {
  authenticate,
} = require("../middleware/auth.middleware");

const {
  createOrderSchema,
} = require("../validators/order.validator");

const router = express.Router();

router.post(
  "/",
  authenticate,
  (req, res, next) => {
    const result = createOrderSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.issues,
      });
    }

    req.body = result.data;
    next();
  },
  createOrder
);

router.get(
    "/",
    authenticate,
    getOrders
  );

  router.get(
    "/:id",
    authenticate,
    getOrderById
  );

module.exports = router;