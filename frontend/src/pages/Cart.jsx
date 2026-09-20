import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiArrowRight,
  FiMinus,
  FiPackage,
  FiPlus,
  FiRefreshCw,
  FiShoppingBag,
  FiTrash2,
} from "react-icons/fi";

import Navbar from "../components/Navbar";

import {
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../services/cartService";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [clearLoading, setClearLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getCart(token);
      setCart(data.cart);
    } catch (error) {
      console.error("Fetch cart error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      setError("Please login to view your cart.");
      setLoading(false);
      return;
    }

    fetchCart();
  }, []);

  const handleUpdateQuantity = async (cartItemId, quantity) => {
    if (quantity < 1) return;

    try {
      setActionLoading(cartItemId);
      setError("");

      await updateCartItem(cartItemId, quantity, token);
      await fetchCart();
    } catch (error) {
      console.error("Update cart error:", error);
      setError(error.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemove = async (cartItemId) => {
    try {
      setActionLoading(cartItemId);
      setError("");

      await removeCartItem(cartItemId, token);
      await fetchCart();
    } catch (error) {
      console.error("Remove cart item error:", error);
      setError(error.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleClearCart = async () => {
    try {
      setClearLoading(true);
      setError("");

      await clearCart(token);
      await fetchCart();
    } catch (error) {
      console.error("Clear cart error:", error);
      setError(error.message);
    } finally {
      setClearLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!cart?.items) {
      return 0;
    }

    return cart.items.reduce((total, item) => {
      return total + Number(item.variant.price) * item.quantity;
    }, 0);
  };

  const totalItems =
    cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  const formatPrice = (price) => {
    return Number(price).toLocaleString("en-IN");
  };

  // -----------------------------
  // Loading State
  // -----------------------------

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="min-h-[80vh] bg-[#FAF9F5] px-4 py-16">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-center py-20">
            <FiRefreshCw className="animate-spin text-4xl text-[#C9A227]" />

            <p className="mt-4 text-sm font-medium text-gray-600">
              Loading your cart...
            </p>
          </div>
        </main>
      </>
    );
  }

  // -----------------------------
  // Main UI
  // -----------------------------

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#FAF9F5]">
        {/* Header */}
        <section className="border-b border-[#E8E3D5] bg-white">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F7F2DF] text-[#A88416]">
                <FiShoppingBag className="text-xl" />
              </div>

              <div>
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#A88416]">
                  Your Shopping Cart
                </p>

                <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  Review Your Items
                </h1>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          {/* Error */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Not logged in */}
          {!token ? (
            <div className="rounded-2xl border border-[#E8E3D5] bg-white px-6 py-16 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F7F2DF] text-[#A88416]">
                <FiShoppingBag className="text-2xl" />
              </div>

              <h2 className="mt-6 text-2xl font-bold text-gray-900">
                Please login to view your cart
              </h2>

              <p className="mx-auto mt-2 max-w-md text-gray-600">
                Login to access your saved cart items and continue shopping.
              </p>

              <Link
                to="/login"
                className="mt-7 inline-flex items-center gap-2 rounded-lg bg-[#C9A227] px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#A88416]"
              >
                Login
                <FiArrowRight />
              </Link>
            </div>
          ) : !cart || cart.items.length === 0 ? (
            /* Empty Cart */
            <div className="rounded-2xl border border-[#E8E3D5] bg-white px-6 py-16 text-center shadow-sm">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#F7F2DF] text-[#C9A227]">
                <FiShoppingBag className="text-3xl" />
              </div>

              <h2 className="mt-6 text-2xl font-bold text-gray-900">
                Your cart is empty
              </h2>

              <p className="mx-auto mt-2 max-w-md text-gray-600">
                Looks like you haven't added anything to your cart yet.
                Explore our traditional Godavari foods and find something you
                love.
              </p>

              <Link
                to="/products"
                className="mt-7 inline-flex items-center gap-2 rounded-lg bg-[#C9A227] px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#A88416]"
              >
                Continue Shopping
                <FiArrowRight />
              </Link>
            </div>
          ) : (
            <>
              {/* Top Row */}
              <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <p className="text-sm text-gray-500">
                    {totalItems}{" "}
                    {totalItems === 1 ? "item" : "items"} in your cart
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleClearCart}
                  disabled={clearLoading}
                  className="inline-flex items-center gap-2 self-start rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition-all duration-200 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto"
                >
                  <FiTrash2 />

                  {clearLoading ? "Clearing..." : "Clear Cart"}
                </button>
              </div>

              {/* Cart Layout */}
              <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
                {/* Cart Items */}
                <div className="space-y-4">
                  {cart.items.map((item) => {
                    const primaryImage = item.product.images?.find(
                      (image) => image.isPrimary
                    );

                    const imageUrl =
                      primaryImage?.url ||
                      item.product.images?.[0]?.url ||
                      "";

                    const itemSubtotal =
                      Number(item.variant.price) * item.quantity;

                    const isLoading = actionLoading === item.id;

                    return (
                      <article
                        key={item.id}
                        className="overflow-hidden rounded-2xl border border-[#E8E3D5] bg-white shadow-sm transition-all duration-200 hover:border-[#C9A227] hover:shadow-md"
                      >
                        <div className="flex flex-col gap-5 p-4 sm:flex-row sm:p-5">
                          {/* Product Image */}
                          <Link
                            to={`/products/${item.product.id}`}
                            className="group h-32 w-full shrink-0 overflow-hidden rounded-xl bg-[#F7F2DF] sm:h-32 sm:w-36"
                          >
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={
                                  primaryImage?.altText ||
                                  item.product.name
                                }
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-[#C9A227]">
                                <FiPackage className="text-4xl" />
                              </div>
                            )}
                          </Link>

                          {/* Product Info */}
                          <div className="flex min-w-0 flex-1 flex-col">
                            <div className="flex flex-col justify-between gap-3 sm:flex-row">
                              <div>
                                <Link
                                  to={`/products/${item.product.id}`}
                                  className="text-lg font-bold text-gray-900 transition-colors duration-200 hover:text-[#A88416]"
                                >
                                  {item.product.name}
                                </Link>

                                <p className="mt-1 text-sm text-gray-500">
                                  Variant:{" "}
                                  <span className="font-medium text-gray-700">
                                    {item.variant.quantity}
                                  </span>
                                </p>
                              </div>

                              {/* Remove */}
                              <button
                                type="button"
                                onClick={() => handleRemove(item.id)}
                                disabled={isLoading}
                                className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors duration-200 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <FiTrash2 />

                                Remove
                              </button>
                            </div>

                            {/* Bottom */}
                            <div className="mt-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                              <div>
                                <p className="text-xs text-gray-500">
                                  Price
                                </p>

                                <p className="mt-1 text-lg font-bold text-[#A88416]">
                                  ₹{formatPrice(item.variant.price)}
                                </p>
                              </div>

                              {/* Quantity */}
                              <div>
                                <p className="mb-1.5 text-xs text-gray-500">
                                  Quantity
                                </p>

                                <div className="flex w-fit items-center overflow-hidden rounded-lg border border-[#E8E3D5]">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleUpdateQuantity(
                                        item.id,
                                        item.quantity - 1
                                      )
                                    }
                                    disabled={
                                      item.quantity <= 1 || isLoading
                                    }
                                    className="flex h-10 w-10 items-center justify-center text-gray-700 transition-colors duration-200 hover:bg-[#F7F2DF] hover:text-[#A88416] disabled:cursor-not-allowed disabled:opacity-30"
                                  >
                                    <FiMinus />
                                  </button>

                                  <span className="flex h-10 min-w-12 items-center justify-center border-x border-[#E8E3D5] px-3 text-sm font-semibold text-gray-900">
                                    {isLoading ? (
                                      <FiRefreshCw className="animate-spin text-[#C9A227]" />
                                    ) : (
                                      item.quantity
                                    )}
                                  </span>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleUpdateQuantity(
                                        item.id,
                                        item.quantity + 1
                                      )
                                    }
                                    disabled={
                                      item.quantity >= item.variant.stock ||
                                      isLoading
                                    }
                                    className="flex h-10 w-10 items-center justify-center text-gray-700 transition-colors duration-200 hover:bg-[#F7F2DF] hover:text-[#A88416] disabled:cursor-not-allowed disabled:opacity-30"
                                  >
                                    <FiPlus />
                                  </button>
                                </div>

                                <p className="mt-1 text-xs text-gray-400">
                                  {item.variant.stock} available
                                </p>
                              </div>

                              {/* Subtotal */}
                              <div className="sm:text-right">
                                <p className="text-xs text-gray-500">
                                  Subtotal
                                </p>

                                <p className="mt-1 text-xl font-bold text-gray-900">
                                  ₹{formatPrice(itemSubtotal)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}

                  {/* Continue Shopping */}
                  <Link
                    to="/products"
                    className="inline-flex items-center gap-2 pt-2 text-sm font-semibold text-[#A88416] transition-colors duration-200 hover:text-[#80650F]"
                  >
                    <FiArrowLeft />

                    Continue Shopping
                  </Link>
                </div>

                {/* Order Summary */}
                <aside className="h-fit rounded-2xl border border-[#E8E3D5] bg-white p-6 shadow-sm lg:sticky lg:top-24">
                  <div className="flex items-center gap-3 border-b border-[#E8E3D5] pb-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F7F2DF] text-[#A88416]">
                      <FiShoppingBag />
                    </div>

                    <div>
                      <h2 className="text-lg font-bold text-gray-900">
                        Order Summary
                      </h2>

                      <p className="text-xs text-gray-500">
                        Review your order
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 py-5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Items</span>

                      <span className="font-medium text-gray-900">
                        {totalItems}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        Product subtotal
                      </span>

                      <span className="font-medium text-gray-900">
                        ₹{formatPrice(calculateTotal())}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Delivery</span>

                      <span className="font-medium text-[#A88416]">
                        Calculated at checkout
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-[#E8E3D5] pt-5">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-semibold text-gray-900">
                        Total
                      </span>

                      <span className="text-2xl font-bold text-[#A88416]">
                        ₹{formatPrice(calculateTotal())}
                      </span>
                    </div>

                    <Link
                      to="/checkout"
                      className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#C9A227] px-5 py-3.5 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:bg-[#A88416] hover:shadow-md"
                    >
                      Proceed to Checkout
                      <FiArrowRight />
                    </Link>

                    <p className="mt-4 text-center text-xs leading-5 text-gray-500">
                      Your order will be securely processed at checkout.
                    </p>
                  </div>
                </aside>
              </div>
            </>
          )}
        </section>
      </main>
    </>
  );
};

export default Cart;