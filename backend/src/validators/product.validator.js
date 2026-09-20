const { z } = require("zod");

const productVariantSchema = z.object({
  quantity: z
    .string()
    .min(1, "Quantity is required")
    .max(30, "Quantity must not exceed 30 characters")
    .trim(),

  price: z.number().positive("Variant price must be greater than 0"),

  stock: z
    .number()
    .int("Variant stock must be a whole number")
    .min(0, "Variant stock cannot be negative"),
});

const createProductSchema = z.object({
  name: z
    .string()
    .min(2, "Product name must be at least 2 characters")
    .max(100, "Product name must not exceed 100 characters")
    .trim(),

  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .max(120, "Slug must not exceed 120 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase letters, numbers, and hyphens"
    )
    .trim(),

  description: z
    .string()
    .max(1000, "Description must not exceed 1000 characters")
    .trim()
    .optional(),

  price: z.number().positive("Price must be greater than 0"),

  stock: z
    .number()
    .int("Stock must be a whole number")
    .min(0, "Stock cannot be negative"),

  categoryId: z
    .number()
    .int("Category ID must be a whole number")
    .positive("Category ID must be greater than 0"),

  images: z
    .array(
      z.object({
        url: z.string().url("Please provide a valid image URL"),

        altText: z
          .string()
          .max(200, "Alt text must not exceed 200 characters")
          .trim()
          .optional(),

        isPrimary: z.boolean().optional(),
      })
    )
    .min(1, "At least one image is required")
    .max(3, "A product can have a maximum of 3 images"),

  variants: z
    .array(productVariantSchema)
    .min(1, "At least one product variant is required")
    .max(10, "A product can have a maximum of 10 variants"),
});

const updateProductSchema = createProductSchema.partial();

module.exports = {
  createProductSchema,
  updateProductSchema,
};