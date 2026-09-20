const { z } = require("zod");

const createAddressSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must not exceed 100 characters")
    .trim(),

  phone: z
    .string()
    .min(10, "Phone number must be at least 10 characters")
    .max(15, "Phone number must not exceed 15 characters")
    .trim(),

  addressLine1: z
    .string()
    .min(3, "Address is too short")
    .max(200, "Address must not exceed 200 characters")
    .trim(),

  addressLine2: z
    .string()
    .max(200, "Address line 2 must not exceed 200 characters")
    .trim()
    .optional(),

  city: z
    .string()
    .min(2, "City must be at least 2 characters")
    .max(100, "City must not exceed 100 characters")
    .trim(),

  state: z
    .string()
    .min(2, "State must be at least 2 characters")
    .max(100, "State must not exceed 100 characters")
    .trim(),

  postalCode: z
    .string()
    .min(4, "Postal code is too short")
    .max(10, "Postal code is too long")
    .trim(),

  country: z
    .string()
    .min(2, "Country must be at least 2 characters")
    .max(100, "Country must not exceed 100 characters")
    .trim()
    .optional(),

  isDefault: z
    .boolean()
    .optional(),
});

const updateAddressSchema = createAddressSchema.partial();

module.exports = {
  createAddressSchema,
  updateAddressSchema,
};