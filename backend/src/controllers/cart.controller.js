const prisma = require("../config/prisma");

const addToCart = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { productId, variantId, quantity } = req.body;

    // 1. Check whether the product exists
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // 2. Check whether the variant exists
    const variant = await prisma.productVariant.findUnique({
      where: {
        id: variantId,
      },
    });

    if (!variant) {
      return res.status(404).json({
        message: "Product variant not found",
      });
    }

    // 3. Make sure the variant belongs to this product
    if (variant.productId !== productId) {
      return res.status(400).json({
        message: "Product variant does not belong to this product",
      });
    }

    // 4. Check stock
    if (quantity > variant.stock) {
      return res.status(400).json({
        message: `Only ${variant.stock} items are available in stock`,
      });
    }

    // 5. Find the user's cart
    let cart = await prisma.cart.findUnique({
      where: {
        userId,
      },
    });

    // 6. Create cart if the user doesn't have one
    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId,
        },
      });
    }

    // 7. Check whether this variant is already in the cart
    const existingCartItem = await prisma.cartItem.findUnique({
      where: {
        cartId_variantId: {
          cartId: cart.id,
          variantId,
        },
      },
    });

    if (existingCartItem) {
      const newQuantity = existingCartItem.quantity + quantity;

      // 8. Make sure the new total doesn't exceed stock
      if (newQuantity > variant.stock) {
        return res.status(400).json({
          message: `Cannot add ${quantity} more. Only ${
            variant.stock - existingCartItem.quantity
          } more items can be added`,
        });
      }

      const updatedCartItem = await prisma.cartItem.update({
        where: {
          id: existingCartItem.id,
        },
        data: {
          quantity: newQuantity,
        },
        include: {
          product: true,
          variant: true,
        },
      });

      return res.status(200).json({
        message: "Cart item quantity updated",
        cartItem: updatedCartItem,
      });
    }

    // 9. Create a new cart item
    const cartItem = await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        variantId,
        quantity,
      },
      include: {
        product: true,
        variant: true,
      },
    });

    return res.status(201).json({
      message: "Product added to cart",
      cartItem,
    });
  } catch (error) {
    console.error("Add to cart error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};


const getCart = async (req, res) => {
    try {
      const userId = req.user.userId;
  
      const cart = await prisma.cart.findUnique({
        where: {
          userId,
        },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: true,
                },
              },
              variant: true,
            },
          },
        },
      });
  
      // User does not have a cart yet
      if (!cart) {
        return res.status(200).json({
          message: "Cart is empty",
          cart: null,
          items: [],
        });
      }
  
      return res.status(200).json({
        message: "Cart fetched successfully",
        cart,
      });
    } catch (error) {
      console.error("Get cart error:", error);
  
      return res.status(500).json({
        message: "Something went wrong",
      });
    }
  };

  const updateCartItem = async (req, res) => {
    try {
      const userId = req.user.userId;
      const cartItemId = Number(req.params.id);
      const { quantity } = req.body;
  
      // 1. Validate cart item ID
      if (!Number.isInteger(cartItemId) || cartItemId < 1) {
        return res.status(400).json({
          message: "Invalid cart item ID",
        });
      }
  
      // 2. Find the cart item and make sure it belongs to this user
      const cartItem = await prisma.cartItem.findFirst({
        where: {
          id: cartItemId,
          cart: {
            userId,
          },
        },
        include: {
          product: true,
          variant: true,
        },
      });
  
      if (!cartItem) {
        return res.status(404).json({
          message: "Cart item not found",
        });
      }
  
      // 3. Check stock
      if (quantity > cartItem.variant.stock) {
        return res.status(400).json({
          message: `Only ${cartItem.variant.stock} items are available in stock`,
        });
      }
  
      // 4. Update quantity
      const updatedCartItem = await prisma.cartItem.update({
        where: {
          id: cartItemId,
        },
        data: {
          quantity,
        },
        include: {
          product: true,
          variant: true,
        },
      });
  
      return res.status(200).json({
        message: "Cart item updated successfully",
        cartItem: updatedCartItem,
      });
    } catch (error) {
      console.error("Update cart item error:", error);
  
      return res.status(500).json({
        message: "Something went wrong",
      });
    }
  };

  const removeCartItem = async (req, res) => {
    try {
      const userId = req.user.userId;
      const cartItemId = Number(req.params.id);
  
      // 1. Validate cart item ID
      if (!Number.isInteger(cartItemId) || cartItemId < 1) {
        return res.status(400).json({
          message: "Invalid cart item ID",
        });
      }
  
      // 2. Find the cart item and verify ownership
      const cartItem = await prisma.cartItem.findFirst({
        where: {
          id: cartItemId,
          cart: {
            userId,
          },
        },
      });
  
      if (!cartItem) {
        return res.status(404).json({
          message: "Cart item not found",
        });
      }
  
      // 3. Delete the cart item
      await prisma.cartItem.delete({
        where: {
          id: cartItemId,
        },
      });
  
      return res.status(200).json({
        message: "Cart item removed successfully",
      });
    } catch (error) {
      console.error("Remove cart item error:", error);
  
      return res.status(500).json({
        message: "Something went wrong",
      });
    }
  };

  const clearCart = async (req, res) => {
    try {
      const userId = req.user.userId;
  
      const cart = await prisma.cart.findUnique({
        where: {
          userId,
        },
      });
  
      if (!cart) {
        return res.status(404).json({
          message: "Cart not found",
        });
      }
  
      await prisma.cartItem.deleteMany({
        where: {
          cartId: cart.id,
        },
      });
  
      return res.status(200).json({
        message: "Cart cleared successfully",
      });
    } catch (error) {
      console.error("Clear cart error:", error);
  
      return res.status(500).json({
        message: "Something went wrong",
      });
    }
  };
module.exports = {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};