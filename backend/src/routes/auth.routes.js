const express = require("express");

const {
    register,
    login,
    getMe,
  } = require("../controllers/auth.controller");
  const {
    authenticate,
    authorize,
  } = require("../middleware/auth.middleware");

const {
  registerSchema,
  loginSchema,
} = require("../validators/auth.validator");

const router = express.Router();

router.post("/register", (req, res, next) => {
  const result = registerSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: result.error.issues,
    });
  }

  req.body = result.data;

  next();
}, register);

router.post("/login", (req, res, next) => {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: result.error.issues,
    });
  }

  req.body = result.data;

  next();
}, login);

// Protected route
router.get("/me", authenticate, getMe);

router.get(
    "/admin-test",
    authenticate,
    authorize("ADMIN"),
    (req, res) => {
      res.json({
        message: "Welcome Admin!",
      });
    }
  );
module.exports = router;