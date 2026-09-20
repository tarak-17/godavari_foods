const express = require("express");

const {
    createAddress,
    getAddresses,
    getAddressById,
    updateAddress,
    deleteAddress,
  } = require("../controllers/address.controller");

const {
  authenticate,
} = require("../middleware/auth.middleware");

const {
    createAddressSchema,
    updateAddressSchema,
  } = require("../validators/address.validator");

const router = express.Router();

router.get(
  "/",
  authenticate,
  getAddresses
);

router.post(
  "/",
  authenticate,
  (req, res, next) => {
    const result = createAddressSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.issues,
      });
    }

    req.body = result.data;
    next();
  },
  createAddress
);

router.get(
    "/:id",
    authenticate,
    getAddressById
  );


  router.patch(
    "/:id",
    authenticate,
    (req, res, next) => {
      const result = updateAddressSchema.safeParse(req.body);
  
      if (!result.success) {
        return res.status(400).json({
          message: "Validation failed",
          errors: result.error.issues,
        });
      }
  
      req.body = result.data;
      next();
    },
    updateAddress
  );

  router.delete(
    "/:id",
    authenticate,
    deleteAddress
  );

module.exports = router;