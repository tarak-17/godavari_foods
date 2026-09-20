import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiHome,
  FiLoader,
  FiMapPin,
  FiPackage,
  FiPlus,
  FiShoppingBag,
} from "react-icons/fi";

import Navbar from "../components/Navbar";

import { getCart } from "../services/cartService";
import { getAddresses } from "../services/addressService";
import { createOrder } from "../services/orderService";

const Checkout = () => {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [loading, setLoading] = useState(true);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCheckoutData = async () => {
      if (!token) {
        setError("Please login to continue.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const [cartData, addressData] = await Promise.all([
          getCart(token),
          getAddresses(token),
        ]);

        setCart(cartData.cart);
        setAddresses(addressData.addresses);

        const defaultAddress = addressData.addresses.find(
          (address) => address.isDefault
        );

        if (defaultAddress) {
          setSelectedAddressId(String(defaultAddress.id));
        } else if (addressData.addresses.length > 0) {
          setSelectedAddressId(String(addressData.addresses[0].id));
        }
      } catch (error) {
        console.error("Checkout data error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCheckoutData();
  }, [token]);

  const calculateTotal = () => {
    if (!cart?.items) {
      return 0;
    }

    return cart.items.reduce((total, item) => {
      return (
        total + Number(item.variant.price) * item.quantity
      );
    }, 0);
  };

  const totalItems =
    cart?.items?.reduce(
      (total, item) => total + item.quantity,
      0
    ) || 0;

  const formatPrice = (price) => {
    return Number(price).toLocaleString("en-IN");
  };

  const handleCreateOrder = async () => {
    if (!selectedAddressId) {
      setError("Please select a delivery address.");
      return;
    }

    try {
      setCreatingOrder(true);
      setError("");

      const data = await createOrder(
        Number(selectedAddressId),
        token
      );

      navigate(`/orders/${data.order.id}`);
    } catch (error) {
      console.error("Create order error:", error);
      setError(error.message);
    } finally {
      setCreatingOrder(false);
    }
  };

  // -----------------------------------
  // Loading
  // -----------------------------------

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="min-h-[80vh] bg-[#FAF9F5]">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-24">
            <FiLoader className="animate-spin text-4xl text-[#C9A227]" />

            <p className="mt-4 text-sm font-medium text-gray-600">
              Preparing your checkout...
            </p>
          </div>
        </main>
      </>
    );
  }

  // -----------------------------------
  // Login Required
  // -----------------------------------

  if (!token) {
    return (
      <>
        <Navbar />

        <main className="min-h-screen bg-[#FAF9F5] px-4 py-16">
          <div className="mx-auto max-w-2xl rounded-2xl border border-[#E8E3D5] bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F7F2DF] text-[#A88416]">
              <FiShoppingBag className="text-2xl" />
            </div>

            <h1 className="mt-6 text-2xl font-bold text-gray-900">
              Login Required
            </h1>

            <p className="mt-2 text-gray-600">
              Please login to continue with your checkout.
            </p>

            <Link
              to="/login"
              className="mt-7 inline-flex items-center gap-2 rounded-lg bg-[#C9A227] px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#A88416]"
            >
              Login
              <FiArrowRight />
            </Link>
          </div>
        </main>
      </>
    );
  }

  // -----------------------------------
  // Error without cart
  // -----------------------------------

  if (error && !cart) {
    return (
      <>
        <Navbar />

        <main className="min-h-screen bg-[#FAF9F5] px-4 py-16">
          <div className="mx-auto max-w-2xl rounded-2xl border border-red-200 bg-white px-6 py-12 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-gray-900">
              Unable to load checkout
            </h1>

            <p className="mt-3 text-red-600">
              {error}
            </p>

            <Link
              to="/cart"
              className="mt-6 inline-flex items-center gap-2 rounded-lg border border-[#C9A227] px-5 py-3 text-sm font-semibold text-[#A88416] transition-all duration-200 hover:bg-[#C9A227] hover:text-white"
            >
              <FiArrowLeft />
              Back to Cart
            </Link>
          </div>
        </main>
      </>
    );
  }

  // -----------------------------------
  // Empty Cart
  // -----------------------------------

  if (!cart || cart.items.length === 0) {
    return (
      <>
        <Navbar />

        <main className="min-h-screen bg-[#FAF9F5] px-4 py-16">
          <div className="mx-auto max-w-2xl rounded-2xl border border-[#E8E3D5] bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#F7F2DF] text-[#C9A227]">
              <FiShoppingBag className="text-3xl" />
            </div>

            <h1 className="mt-6 text-2xl font-bold text-gray-900">
              Your cart is empty
            </h1>

            <p className="mt-2 text-gray-600">
              Add some delicious Godavari foods to your cart
              before checking out.
            </p>

            <Link
              to="/products"
              className="mt-7 inline-flex items-center gap-2 rounded-lg bg-[#C9A227] px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#A88416]"
            >
              Continue Shopping
              <FiArrowRight />
            </Link>
          </div>
        </main>
      </>
    );
  }

  // -----------------------------------
  // Main Checkout
  // -----------------------------------

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#FAF9F5]">
        {/* Header */}
        <section className="border-b border-[#E8E3D5] bg-white">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <Link
              to="/cart"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors duration-200 hover:text-[#A88416]"
            >
              <FiArrowLeft />
              Back to Cart
            </Link>

            <div className="mt-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F7F2DF] text-[#A88416]">
                <FiShoppingBag className="text-xl" />
              </div>

              <div>
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#A88416]">
                  Secure Checkout
                </p>

                <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  Complete Your Order
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

          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            {/* -------------------------------- */}
            {/* LEFT SIDE */}
            {/* -------------------------------- */}

            <div className="space-y-8">
              {/* Delivery Address */}
              <section className="rounded-2xl border border-[#E8E3D5] bg-white p-5 shadow-sm sm:p-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F7F2DF] text-[#A88416]">
                      <FiMapPin />
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        Delivery Address
                      </h2>

                      <p className="mt-1 text-sm text-gray-500">
                        Choose where you want your order delivered.
                      </p>
                    </div>
                  </div>

                  <Link
                    to="/addresses"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#A88416] transition-colors duration-200 hover:text-[#80650F]"
                  >
                    <FiPlus />
                    Manage Addresses
                  </Link>
                </div>

                {addresses.length === 0 ? (
                  <div className="mt-6 rounded-xl border border-dashed border-[#C9A227] bg-[#F7F2DF]/40 px-5 py-8 text-center">
                    <FiHome className="mx-auto text-3xl text-[#C9A227]" />

                    <h3 className="mt-3 font-semibold text-gray-900">
                      No saved addresses
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Add an address before placing your order.
                    </p>

                    <Link
                      to="/addresses"
                      className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#C9A227] px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#A88416]"
                    >
                      <FiPlus />
                      Add Address
                    </Link>
                  </div>
                ) : (
                  <div className="mt-6 space-y-4">
                    {addresses.map((address) => {
                      const isSelected =
                        selectedAddressId === String(address.id);

                      return (
                        <label
                          key={address.id}
                          className={`block cursor-pointer rounded-xl border p-4 transition-all duration-200 sm:p-5 ${
                            isSelected
                              ? "border-[#C9A227] bg-[#F7F2DF]/50 shadow-sm"
                              : "border-[#E8E3D5] bg-white hover:border-[#C9A227]"
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            {/* Radio */}
                            <div className="pt-1">
                              <input
                                type="radio"
                                name="address"
                                value={address.id}
                                checked={isSelected}
                                onChange={(e) =>
                                  setSelectedAddressId(
                                    e.target.value
                                  )
                                }
                                className="h-4 w-4 accent-[#C9A227]"
                              />
                            </div>

                            {/* Address */}
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="font-bold text-gray-900">
                                  {address.fullName}
                                </h3>

                                {address.isDefault && (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-[#F7F2DF] px-2.5 py-1 text-xs font-semibold text-[#A88416]">
                                    <FiCheck className="text-xs" />
                                    Default
                                  </span>
                                )}

                                {isSelected && (
                                  <span className="rounded-full bg-[#C9A227] px-2.5 py-1 text-xs font-semibold text-white">
                                    Selected
                                  </span>
                                )}
                              </div>

                              <p className="mt-2 text-sm font-medium text-gray-600">
                                {address.phone}
                              </p>

                              <div className="mt-3 space-y-1 text-sm leading-6 text-gray-600">
                                <p>{address.addressLine1}</p>

                                {address.addressLine2 && (
                                  <p>{address.addressLine2}</p>
                                )}

                                <p>
                                  {address.city},{" "}
                                  {address.state}{" "}
                                  {address.postalCode}
                                </p>
                              </div>
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                )}
              </section>

              {/* Order Items */}
              <section className="rounded-2xl border border-[#E8E3D5] bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F7F2DF] text-[#A88416]">
                    <FiPackage />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Your Items
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      {totalItems}{" "}
                      {totalItems === 1 ? "item" : "items"} in
                      your order
                    </p>
                  </div>
                </div>

                <div className="mt-6 divide-y divide-[#E8E3D5]">
                  {cart.items.map((item) => {
                    const primaryImage =
                      item.product.images?.find(
                        (image) => image.isPrimary
                      );

                    const imageUrl =
                      primaryImage?.url ||
                      item.product.images?.[0]?.url ||
                      "";

                    const subtotal =
                      Number(item.variant.price) *
                      item.quantity;

                    return (
                      <div
                        key={item.id}
                        className="flex gap-4 py-5 first:pt-0 last:pb-0"
                      >
                        {/* Image */}
                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#F7F2DF] sm:h-24 sm:w-24">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={
                                primaryImage?.altText ||
                                item.product.name
                              }
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[#C9A227]">
                              <FiPackage className="text-2xl" />
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {item.product.name}
                          </h3>

                          <p className="mt-1 text-sm text-gray-500">
                            {item.variant.quantity}
                          </p>

                          <p className="mt-2 text-sm text-gray-600">
                            ₹{formatPrice(item.variant.price)} ×{" "}
                            {item.quantity}
                          </p>
                        </div>

                        {/* Price */}
                        <div className="shrink-0 text-right">
                          <p className="text-sm text-gray-500">
                            Subtotal
                          </p>

                          <p className="mt-1 font-bold text-gray-900">
                            ₹{formatPrice(subtotal)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>

            {/* -------------------------------- */}
            {/* RIGHT SIDE */}
            {/* -------------------------------- */}

            <aside className="h-fit lg:sticky lg:top-24">
              <div className="rounded-2xl border border-[#E8E3D5] bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 border-b border-[#E8E3D5] pb-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F7F2DF] text-[#A88416]">
                    <FiShoppingBag />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      Order Summary
                    </h2>

                    <p className="text-xs text-gray-500">
                      Review before placing your order
                    </p>
                  </div>
                </div>

                <div className="space-y-4 py-5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      Items
                    </span>

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
                    <span className="text-gray-600">
                      Delivery
                    </span>

                    <span className="font-medium text-[#A88416]">
                      Calculated later
                    </span>
                  </div>
                </div>

                <div className="border-t border-[#E8E3D5] pt-5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900">
                      Total
                    </span>

                    <span className="text-2xl font-bold text-[#A88416]">
                      ₹{formatPrice(calculateTotal())}
                    </span>
                  </div>

                  {addresses.length > 0 ? (
                    <button
                      type="button"
                      onClick={handleCreateOrder}
                      disabled={creatingOrder || !selectedAddressId}
                      className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#C9A227] px-5 py-3.5 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:bg-[#A88416] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {creatingOrder ? (
                        <>
                          <FiLoader className="animate-spin" />
                          Creating Order...
                        </>
                      ) : (
                        <>
                          Place Order
                          <FiArrowRight />
                        </>
                      )}
                    </button>
                  ) : (
                    <Link
                      to="/addresses"
                      className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#C9A227] px-5 py-3.5 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:bg-[#A88416] hover:shadow-md"
                    >
                      <FiPlus />
                      Add Delivery Address
                    </Link>
                  )}

                  <p className="mt-4 text-center text-xs leading-5 text-gray-500">
                    By placing your order, you confirm that
                    your delivery information is correct.
                  </p>
                </div>
              </div>

              {/* Trust Information */}
              <div className="mt-4 rounded-2xl border border-[#E8E3D5] bg-white p-5">
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F7F2DF] text-[#A88416]">
                      <FiCheck />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Authentic Products
                      </p>

                      <p className="mt-1 text-xs leading-5 text-gray-500">
                        Traditional foods made with care.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F7F2DF] text-[#A88416]">
                      <FiPackage />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Secure Packaging
                      </p>

                      <p className="mt-1 text-xs leading-5 text-gray-500">
                        Carefully packed for delivery.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </>
  );
};

export default Checkout;