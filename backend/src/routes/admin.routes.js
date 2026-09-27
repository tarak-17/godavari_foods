const express = require("express");
const prisma = require("../config/prisma");

const {
  authenticate,
  authorize,
} = require("../middleware/auth.middleware");

const router = express.Router();

// =====================================
// ADMIN AUTHENTICATION & AUTHORIZATION
// =====================================

router.use(authenticate);
router.use(authorize("ADMIN"));

// =====================================
// ADMIN DASHBOARD
// =====================================

router.get("/dashboard", async (req, res) => {
  try {
    const totalProducts = await prisma.product.count();

    const totalCustomers = await prisma.user.count({
      where: {
        role: "CUSTOMER",
      },
    });

    const totalOrders = await prisma.order.count();

    const revenueResult = await prisma.order.aggregate({
      _sum: {
        totalAmount: true,
      },
    });

    const totalRevenue = revenueResult._sum.totalAmount || 0;

    const recentOrders = await prisma.order.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        totalCustomers,
        totalOrders,
        totalRevenue,
        recentOrders,
      },
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load dashboard data.",
    });
  }
});

// =====================================
// ADMIN — ALL ORDERS
// =====================================

router.get("/orders", async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: "desc",
      },

      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },

        address: true,

        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
              },
            },

            variant: {
              select: {
                id: true,
                quantity: true,
                price: true,
              },
            },
          },
        },

        payment: true,
      },
    });

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("Admin orders error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load orders.",
    });
  }
});

// =====================================
// ADMIN — SINGLE ORDER
// =====================================

router.get("/orders/:id", async (req, res) => {
  try {
    const orderId = Number(req.params.id);

    if (!Number.isInteger(orderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID.",
      });
    }

    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },

      include: {
        // =====================================
        // CUSTOMER
        // =====================================

        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },

        // =====================================
        // DELIVERY ADDRESS
        // =====================================

        address: true,

        // =====================================
        // ORDER ITEMS
        // =====================================

        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
              },
            },

            variant: {
              select: {
                id: true,
                quantity: true,
                price: true,
              },
            },
          },
        },

        // =====================================
        // PAYMENT
        // =====================================

        payment: true,
      },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Admin order details error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load order details.",
    });
  }
});

// =====================================
// ADMIN — UPDATE ORDER STATUS
// =====================================

router.patch("/orders/:id/status", async (req, res) => {
    try {
      const orderId = Number(req.params.id);
      const { status } = req.body;
  
      // =====================================
      // VALIDATE ORDER ID
      // =====================================
  
      if (!Number.isInteger(orderId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid order ID.",
        });
      }
  
      // =====================================
      // ALLOWED STATUSES
      // =====================================
  
      const allowedStatuses = [
        "PENDING",
        "CONFIRMED",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED",
      ];
  
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid order status.",
        });
      }
  
      // =====================================
      // FIND ORDER
      // =====================================
  
      const existingOrder = await prisma.order.findUnique({
        where: {
          id: orderId,
        },
      });
  
      if (!existingOrder) {
        return res.status(404).json({
          success: false,
          message: "Order not found.",
        });
      }
  
      const currentStatus = existingOrder.status;
  
      // =====================================
      // SAME STATUS
      // =====================================
  
      if (currentStatus === status) {
        return res.status(400).json({
          success: false,
          message: `Order is already ${status}.`,
        });
      }
  
      // =====================================
      // VALID STATUS TRANSITIONS
      // =====================================
  
      const validTransitions = {
        PENDING: ["CONFIRMED", "CANCELLED"],
  
        CONFIRMED: ["SHIPPED", "CANCELLED"],
  
        SHIPPED: ["DELIVERED"],
  
        DELIVERED: [],
  
        CANCELLED: [],
      };
  
      const allowedNextStatuses =
        validTransitions[currentStatus] || [];
  
      if (!allowedNextStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Order cannot be changed from ${currentStatus} to ${status}.`,
        });
      }
  
      // =====================================
      // UPDATE ORDER
      // =====================================
  
      const updatedOrder = await prisma.order.update({
        where: {
          id: orderId,
        },
  
        data: {
          status,
        },
      });
  
      // =====================================
      // RESPONSE MESSAGE
      // =====================================
  
      let message = "Order status updated successfully.";
  
      if (status === "CONFIRMED") {
        message = "Order confirmed successfully.";
      }
  
      if (status === "SHIPPED") {
        message = "Order shipped successfully.";
      }
  
      if (status === "DELIVERED") {
        message = "Order delivered successfully.";
      }
  
      if (status === "CANCELLED") {
        message = "Order cancelled successfully.";
      }
  
      // =====================================
      // RESPONSE
      // =====================================
  
      return res.status(200).json({
        success: true,
        message,
        data: updatedOrder,
      });
    } catch (error) {
      console.error(
        "Admin order status update error:",
        error
      );
  
      return res.status(500).json({
        success: false,
        message: "Failed to update order status.",
      });
    }
  });

// =====================================
// EXPORT ROUTER
// =====================================

module.exports = router;