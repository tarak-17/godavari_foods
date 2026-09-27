import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  FiAlertCircle,
  FiArrowRight,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiLoader,
  FiPackage,
  FiShoppingBag,
  FiTruck,
  FiXCircle,
} from "react-icons/fi";

import Navbar from "../components/Navbar";
import { getOrders } from "../services/orderService";

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) {
        setError("Please login to view your orders.");
        setLoading(false);
        return;
      }

      try {
        setError("");

        const data = await getOrders(token);

        setOrders(data.orders || []);
      } catch (error) {
        console.error("Fetch orders error:", error);

        setError(
          error.message || "Failed to fetch orders."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  // =====================================
  // FORMAT PRICE
  // =====================================

  const formatPrice = (price) => {
    return Number(price).toLocaleString("en-IN");
  };

  // =====================================
  // FORMAT DATE
  // =====================================

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =====================================
  // STATUS STYLE
  // =====================================

  const getStatusStyle = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "border-green-200 bg-green-50 text-green-700";

      case "PENDING":
        return "border-yellow-200 bg-yellow-50 text-yellow-700";

      case "SHIPPED":
        return "border-blue-200 bg-blue-50 text-blue-700";

      case "DELIVERED":
        return "border-green-200 bg-green-50 text-green-700";

      case "CANCELLED":
        return "border-red-200 bg-red-50 text-red-700";

      default:
        return "border-gray-200 bg-gray-50 text-gray-700";
    }
  };

  // =====================================
  // PAYMENT STYLE
  // =====================================

  const getPaymentStyle = (status) => {
    if (status === "PAID") {
      return "bg-green-50 text-green-700";
    }

    return "bg-yellow-50 text-yellow-700";
  };

  // =====================================
  // ORDER STATUS PROGRESS
  // =====================================

  const getStatusStep = (status) => {
    switch (status) {
      case "PENDING":
        return 0;

      case "CONFIRMED":
        return 1;

      case "SHIPPED":
        return 2;

      case "DELIVERED":
        return 3;

      default:
        return 0;
    }
  };

  // =====================================
  // STATUS TIMELINE
  // =====================================

  const renderOrderTimeline = (status) => {
    if (status === "CANCELLED") {
      return (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
              <FiXCircle className="text-xl text-red-600" />
            </div>

            <div>
              <p className="text-sm font-semibold text-red-700">
                Order Cancelled
              </p>

              <p className="mt-1 text-xs text-red-600">
                This order has been cancelled.
              </p>
            </div>
          </div>
        </div>
      );
    }

    const currentStep = getStatusStep(status);

    const steps = [
      {
        key: "CONFIRMED",
        label: "Order Confirmed",
        description: "Your order has been confirmed.",
        icon: FiCheckCircle,
      },
      {
        key: "SHIPPED",
        label: "Order Shipped",
        description: "Your order is on the way.",
        icon: FiTruck,
      },
      {
        key: "DELIVERED",
        label: "Order Delivered",
        description: "Your order has been delivered.",
        icon: FiPackage,
      },
    ];

    return (
      <div className="rounded-xl border border-[#E8E3D5] bg-[#FAF9F5] p-5">
        <div className="mb-5">
          <p className="text-sm font-semibold text-gray-900">
            Order Tracking
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Track the progress of your order.
          </p>
        </div>

        <div className="space-y-5">
          {steps.map((step, index) => {
            const StepIcon = step.icon;

            const stepNumber = index + 1;

            const isCompleted =
              currentStep >= stepNumber;

            const isCurrent =
              currentStep === stepNumber;

            return (
              <div
                key={step.key}
                className="relative flex gap-4"
              >
                {/* Vertical Line */}
                {index < steps.length - 1 && (
                  <div
                    className={`absolute left-5 top-10 h-8 w-px ${
                      currentStep > stepNumber
                        ? "bg-[#C9A227]"
                        : "bg-[#E8E3D5]"
                    }`}
                  />
                )}

                {/* Icon */}
                <div
                  className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 ${
                    isCompleted
                      ? "border-[#C9A227] bg-[#F7F2DF] text-[#A88416]"
                      : "border-[#E8E3D5] bg-white text-gray-400"
                  }`}
                >
                  <StepIcon className="text-lg" />
                </div>

                {/* Text */}
                <div className="pt-0.5">
                  <p
                    className={`text-sm font-semibold ${
                      isCompleted
                        ? "text-gray-900"
                        : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </p>

                  <p
                    className={`mt-1 text-xs ${
                      isCompleted
                        ? "text-gray-500"
                        : "text-gray-400"
                    }`}
                  >
                    {step.description}
                  </p>

                  {isCurrent && (
                    <span className="mt-2 inline-flex rounded-full bg-[#F7F2DF] px-2.5 py-1 text-[11px] font-semibold text-[#A88416]">
                      Current Status
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="flex min-h-[70vh] items-center justify-center bg-[#FAF9F5] px-4">
          <div className="flex flex-col items-center text-center">
            <FiLoader className="animate-spin text-4xl text-[#C9A227]" />

            <p className="mt-4 text-sm text-gray-600">
              Loading your orders...
            </p>
          </div>
        </main>
      </>
    );
  }

  // =====================================
  // ERROR
  // =====================================

  if (error) {
    return (
      <>
        <Navbar />

        <main className="flex min-h-[70vh] items-center justify-center bg-[#FAF9F5] px-4">
          <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
              <FiAlertCircle className="text-2xl text-red-500" />
            </div>

            <h1 className="mt-5 text-xl font-bold text-gray-900">
              Unable to load orders
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              {error}
            </p>

            <Link
              to="/products"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#C9A227] px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#A88416]"
            >
              Continue Shopping
              <FiArrowRight />
            </Link>
          </div>
        </main>
      </>
    );
  }

  // =====================================
  // MAIN
  // =====================================

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#FAF9F5] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">

          {/* PAGE HEADER */}

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-[#A88416]">
                Your Account
              </p>

              <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                My Orders
              </h1>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                View and track all your Godavari Foods orders.
              </p>
            </div>

            {orders.length > 0 && (
              <div className="flex items-center gap-2 rounded-full border border-[#E8E3D5] bg-white px-4 py-2 text-sm text-gray-600 shadow-sm">
                <FiShoppingBag className="text-[#C9A227]" />

                <span>
                  {orders.length}{" "}
                  {orders.length === 1
                    ? "Order"
                    : "Orders"}
                </span>
              </div>
            )}
          </div>

          {/* EMPTY STATE */}

          {orders.length === 0 ? (
            <section className="mt-8 rounded-2xl border border-[#E8E3D5] bg-white px-6 py-16 text-center shadow-sm">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#F7F2DF]">
                <FiPackage className="text-4xl text-[#C9A227]" />
              </div>

              <h2 className="mt-6 text-2xl font-bold text-gray-900">
                No orders yet
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-600">
                You haven't placed any orders yet. Explore our
                traditional foods and discover authentic
                Godavari flavours.
              </p>

              <Link
                to="/products"
                className="mt-7 inline-flex items-center gap-2 rounded-lg bg-[#C9A227] px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#A88416]"
              >
                Start Shopping
                <FiArrowRight />
              </Link>
            </section>
          ) : (
            /* ORDERS */

            <section className="mt-8 space-y-5">
              {orders.map((order) => (
                <article
                  key={order.id}
                  className="group overflow-hidden rounded-2xl border border-[#E8E3D5] bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#C9A227] hover:shadow-md"
                >

                  {/* ORDER HEADER */}

                  <div className="border-b border-[#E8E3D5] p-5 sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F7F2DF]">
                            <FiPackage className="text-xl text-[#A88416]" />
                          </div>

                          <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                              Order
                            </p>

                            <h2 className="font-bold text-gray-900">
                              #{order.id}
                            </h2>
                          </div>
                        </div>
                      </div>

                      <span
                        className={`inline-flex w-fit rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusStyle(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* ORDER INFORMATION */}

                  <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-4">

                    {/* DATE */}

                    <div>
                      <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                        <FiCalendar className="text-[#C9A227]" />
                        Order Date
                      </div>

                      <p className="mt-2 text-sm font-semibold text-gray-900">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>

                    {/* ITEMS */}

                    <div>
                      <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                        <FiShoppingBag className="text-[#C9A227]" />
                        Items
                      </div>

                      <p className="mt-2 text-sm font-semibold text-gray-900">
                        {order.items?.length || 0}{" "}
                        {(order.items?.length || 0) === 1
                          ? "Item"
                          : "Items"}
                      </p>
                    </div>

                    {/* TOTAL */}

                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        Total Amount
                      </p>

                      <p className="mt-2 text-lg font-bold text-[#A88416]">
                        ₹{formatPrice(order.totalAmount)}
                      </p>
                    </div>

                    {/* PAYMENT */}

                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        Payment
                      </p>

                      {order.payment ? (
                        <span
                          className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getPaymentStyle(
                            order.payment.status
                          )}`}
                        >
                          {order.payment.status}
                        </span>
                      ) : (
                        <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-yellow-50 px-3 py-1 text-xs font-semibold text-yellow-700">
                          <FiClock />
                          Pending
                        </span>
                      )}
                    </div>
                  </div>

                  {/* ORDER TRACKING */}

                  <div className="border-t border-[#E8E3D5] p-5 sm:p-6">
                    {renderOrderTimeline(order.status)}
                  </div>

                  {/* FOOTER */}

                  <div className="flex flex-col gap-4 border-t border-[#E8E3D5] bg-[#FAF9F5] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">

                    <div className="text-sm text-gray-500">
                      {order.status === "DELIVERED"
                        ? "Your order has been delivered."
                        : order.status === "SHIPPED"
                        ? "Your order has been shipped and is on the way."
                        : order.status === "CONFIRMED"
                        ? "Your order has been confirmed successfully."
                        : order.status === "CANCELLED"
                        ? "This order has been cancelled."
                        : order.payment?.status === "PAID"
                        ? "Payment completed successfully. Your order is being processed."
                        : "Payment is pending for this order."}
                    </div>

                    <Link
                      to={`/orders/${order.id}`}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#C9A227] bg-white px-5 py-2.5 text-sm font-semibold text-[#A88416] transition-all duration-200 hover:bg-[#C9A227] hover:text-white"
                    >
                      View Order

                      <FiArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </article>
              ))}
            </section>
          )}

          {/* BOTTOM SHOPPING CTA */}

          {orders.length > 0 && (
            <div className="mt-8 flex justify-center">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#A88416] transition-colors duration-200 hover:text-[#806510]"
              >
                Continue Shopping
                <FiArrowRight />
              </Link>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default OrdersList;