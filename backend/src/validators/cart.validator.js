const { z } = require("zod");

const addToCartSchema = z.object({
  productId: z
    .number()
    .int("Product ID must be a whole number")
    .positive("Product ID must be greater than 0"),

  variantId: z
    .number()
    .int("Variant ID must be a whole number")
    .positive("Variant ID must be greater than 0"),

  quantity: z
    .number()
    .int("Quantity must be a whole number")
    .min(1, "Quantity must be at least 1"),
});

const updateCartItemSchema = z.object({
  quantity: z
    .number()
    .int("Quantity must be a whole number")
    .min(1, "Quantity must be at least 1"),
});

module.exports = {
  addToCartSchema,
  updateCartItemSchema,
};