const prisma = require("../config/prisma");

const createOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { addressId } = req.body;

    // 1. Check that the address belongs to the logged-in user
    const address = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId,
      },
    });

    if (!address) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    // 2. Get the user's cart with its items
    const cart = await prisma.cart.findUnique({
      where: {
        userId,
      },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    });

    // 3. Make sure the cart exists and has items
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    // 4. Check stock and calculate total
    let totalAmount = 0;

    for (const item of cart.items) {
      if (item.quantity > item.variant.stock) {
        return res.status(400).json({
          message: `Insufficient stock for ${item.product.name} (${item.variant.quantity})`,
        });
      }

      totalAmount += Number(item.variant.price) * item.quantity;
    }

    // 5. Create order and order items inside a transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId,
          addressId,
          totalAmount,
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              variantId: item.variantId,
              quantity: item.quantity,
              unitPrice: item.variant.price,
            })),
          },
        },
        include: {
          items: {
            include: {
              product: true,
              variant: true,
            },
          },
          address: true,
        },
      });

      // 6. Reduce stock
      for (const item of cart.items) {
        await tx.productVariant.update({
          where: {
            id: item.variantId,
          },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      // 7. Clear the cart
      await tx.cartItem.deleteMany({
        where: {
          cartId: cart.id,
        },
      });

      return newOrder;
    });

    return res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("Create order error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

const getOrders = async (req, res) => {
    try {
      const userId = req.user.userId;
  
      const orders = await prisma.order.findMany({
        where: {
          userId,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          items: {
            include: {
              product: true,
              variant: true,
            },
          },
          address: true,
          payment: true,
        },
      });
  
      return res.status(200).json({
        message: "Orders fetched successfully",
        orders,
      });
    } catch (error) {
      console.error("Get orders error:", error);
  
      return res.status(500).json({
        message: "Something went wrong",
      });
    }
  };

  const getOrderById = async (req, res) => {
    try {
      const userId = req.user.userId;
      const orderId = Number(req.params.id);
  
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
          items: {
            include: {
              product: true,
              variant: true,
            },
          },
          address: true,
          payment: true,
        },
      });
  
      if (!order) {
        return res.status(404).json({
          message: "Order not found",
        });
      }
  
      return res.status(200).json({
        message: "Order fetched successfully",
        order,
      });
    } catch (error) {
      console.error("Get order by ID error:", error);
  
      return res.status(500).json({
        message: "Something went wrong",
      });
    }
  };

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
};