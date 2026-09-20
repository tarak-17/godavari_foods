const { z } = require("zod");

const createPaymentSchema = z.object({
  orderId: z
    .number()
    .int("Order ID must be a whole number")
    .positive("Order ID must be greater than 0"),
});

const verifyPaymentSchema = z.object({
  orderId: z
    .number()
    .int("Order ID must be a whole number")
    .positive("Order ID must be greater than 0"),

  razorpayOrderId: z
    .string()
    .min(1, "Razorpay order ID is required"),

  razorpayPaymentId: z
    .string()
    .min(1, "Razorpay payment ID is required"),

  razorpaySignature: z
    .string()
    .min(1, "Razorpay signature is required"),
});

module.exports = {
  createPaymentSchema,
  verifyPaymentSchema,
};