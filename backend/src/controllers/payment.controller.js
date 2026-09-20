const prisma = require("../config/prisma");
const razorpay = require("../config/razorpay");

// Create a payment record for an order
const createPayment = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { orderId } = req.body;

    // Find the order belonging to the logged-in user
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
      },
      include: {
        payment: true,
      },
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Prevent duplicate payments
    if (order.payment) {
      return res.status(400).json({
        message: "Payment already exists for this order",
      });
    }

    // Create a pending payment
    const payment = await prisma.payment.create({
      data: {
        orderId: order.id,
        amount: order.totalAmount,
        method: "RAZORPAY",
        status: "PENDING",
      },
    });

    return res.status(201).json({
      message: "Payment created successfully",
      payment,
    });
  } catch (error) {
    console.error("Create payment error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// Get payment for a specific order
const getPaymentByOrderId = async (req, res) => {
  try {
    const userId = req.user.userId;
    const orderId = Number(req.params.orderId);

    if (!Number.isInteger(orderId) || orderId < 1) {
      return res.status(400).json({
        message: "Invalid order ID",
      });
    }

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
      },
      include: {
        payment: true,
      },
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (!order.payment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    return res.status(200).json({
      message: "Payment fetched successfully",
      payment: order.payment,
    });
  } catch (error) {
    console.error("Get payment error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// Create a Razorpay order
const createRazorpayOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const orderId = Number(req.params.orderId);

    if (!Number.isInteger(orderId) || orderId < 1) {
      return res.status(400).json({
        message: "Invalid order ID",
      });
    }

    // Find the user's order
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
      },
      include: {
        payment: true,
      },
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Payment record must already exist
    if (!order.payment) {
      return res.status(400).json({
        message: "Payment has not been created for this order",
      });
    }

    // Only pending payments can be processed
    if (order.payment.status !== "PENDING") {
      return res.status(400).json({
        message: "Payment is not pending",
      });
    }

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(Number(order.totalAmount) * 100),
      currency: "INR",
      receipt: `order_${order.id}`,
    });

    return res.status(201).json({
      message: "Razorpay order created successfully",
      razorpayOrder,
    });
  } catch (error) {
    console.error("Create Razorpay order error:", error);

    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};



const crypto = require("crypto");

const verifyPayment = async (req, res) => {
  try {
    const userId = req.user.userId;

    const {
      orderId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = req.body;

    // Find the user's order
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
      },
      include: {
        payment: true,
      },
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Make sure payment exists
    if (!order.payment) {
      return res.status(400).json({
        message: "Payment not found for this order",
      });
    }

    // Prevent verifying an already completed payment
    if (order.payment.status === "PAID") {
      return res.status(400).json({
        message: "Payment is already completed",
      });
    }

    // Create the signature that Razorpay expects
    const generatedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    // Compare Razorpay's signature with our generated signature
    if (generatedSignature !== razorpaySignature) {
      return res.status(400).json({
        message: "Payment verification failed",
      });
    }

    // Payment is verified
    const payment = await prisma.payment.update({
      where: {
        id: order.payment.id,
      },
      data: {
        status: "PAID",
        transactionId: razorpayPaymentId,
      },
    });

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        status: "CONFIRMED",
      },
    });

    return res.status(200).json({
      message: "Payment verified successfully",
      payment,
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Verify payment error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

module.exports = {
    createPayment,
    getPaymentByOrderId,
    createRazorpayOrder,
    verifyPayment,
  };