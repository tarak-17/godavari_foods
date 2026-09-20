const express = require("express");

const {
    createPayment,
    getPaymentByOrderId,
    createRazorpayOrder,
    verifyPayment,
  } = require("../controllers/payment.controller");

const {
  authenticate,
} = require("../middleware/auth.middleware");

const {
    createPaymentSchema,
    verifyPaymentSchema,
  } = require("../validators/payment.validator");

const router = express.Router();

router.post(
  "/",
  authenticate,
  (req, res, next) => {
    const result = createPaymentSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.issues,
      });
    }

    req.body = result.data;
    next();
  },
  createPayment
);

router.get(
    "/order/:orderId",
    authenticate,
    getPaymentByOrderId
  );


  router.post(
    "/order/:orderId/razorpay",
    authenticate,
    createRazorpayOrder
  );



  router.post(
    "/verify",
    authenticate,
    (req, res, next) => {
      const result = verifyPaymentSchema.safeParse(req.body);
  
      if (!result.success) {
        return res.status(400).json({
          message: "Validation failed",
          errors: result.error.issues,
        });
      }
  
      req.body = result.data;
      next();
    },
    verifyPayment
  );

module.exports = router;