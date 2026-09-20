const { z } = require("zod");

const createOrderSchema = z.object({
  addressId: z
    .number()
    .int("Address ID must be a whole number")
    .positive("Address ID must be greater than 0"),
});

module.exports = {
  createOrderSchema,
};