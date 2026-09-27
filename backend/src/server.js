const express = require("express");

const cors = require("cors");

require("dotenv").config();

const prisma = require("./config/prisma");

const authRoutes = require("./routes/auth.routes");

const categoryRoutes = require("./routes/category.routes");

const productRoutes = require("./routes/product.routes");

const cartRoutes = require("./routes/cart.routes");

const orderRoutes = require("./routes/order.routes");

const addressRoutes = require("./routes/address.routes");

const paymentRoutes = require("./routes/payment.routes");

const uploadRoutes = require("./routes/upload.routes");

// =====================================
// ADMIN ROUTES
// =====================================

const adminRoutes = require("./routes/admin.routes");

const app = express();

// =====================================
// MIDDLEWARE
// =====================================

app.use(cors());

app.use(express.json());

// =====================================
// ROUTES
// =====================================

app.use("/api/auth", authRoutes);

app.use("/api/categories", categoryRoutes);

app.use("/api/products", productRoutes);

app.use("/api/cart", cartRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/addresses", addressRoutes);

app.use("/api/payments", paymentRoutes);

app.use("/api/uploads", uploadRoutes);

// =====================================
// ADMIN ROUTES
// =====================================

app.use("/api/admin", adminRoutes);

// =====================================
// HOME ROUTE
// =====================================

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Godavari Foods API",
  });
});

// =====================================
// SERVER
// =====================================

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await prisma.$connect();

    console.log(
      "✅ Database connected successfully"
    );

    app.listen(PORT, () => {
      console.log(
        `🚀 Server running on http://localhost:${PORT}`
      );
    });

  } catch (error) {

    console.error(
      "❌ Database connection failed:",
      error
    );

    process.exit(1);
  }
}

startServer();