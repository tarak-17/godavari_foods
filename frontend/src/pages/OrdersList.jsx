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

        setError(error.message || "Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const formatPrice = (price) => {
    return Number(price).toLocaleString("en-IN");
  };

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

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

  const getPaymentStyle = (status) => {
    if (status === "PAID") {
      return "bg-green-50 text-green-700";
    }

    return "bg-yellow-50 text-yellow-700";
  };

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

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#FAF9F5] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Page Header */}
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
                  {orders.length === 1 ? "Order" : "Orders"}
                </span>
              </div>
            )}
          </div>

          {/* Empty State */}
          {orders.length === 0 ? (
            <section className="mt-8 rounded-2xl border border-[#E8E3D5] bg-white px-6 py-16 text-center shadow-sm">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#F7F2DF]">
                <FiPackage className="text-4xl text-[#C9A227]" />
              </div>

              <h2 className="mt-6 text-2xl font-bold text-gray-900">
                No orders yet
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-600">
                You haven't placed any orders yet. Explore our traditional
                foods and discover authentic Godavari flavours.
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
            /* Orders */
            <section className="mt-8 space-y-5">
              {orders.map((order) => (
                <article
                  key={order.id}
                  className="group overflow-hidden rounded-2xl border border-[#E8E3D5] bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#C9A227] hover:shadow-md"
                >
                  {/* Order Header */}
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

                  {/* Order Information */}
                  <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-4">
                    {/* Date */}
                    <div>
                      <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                        <FiCalendar className="text-[#C9A227]" />
                        Order Date
                      </div>

                      <p className="mt-2 text-sm font-semibold text-gray-900">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>

                    {/* Items */}
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

                    {/* Total */}
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        Total Amount
                      </p>

                      <p className="mt-2 text-lg font-bold text-[#A88416]">
                        ₹{formatPrice(order.totalAmount)}
                      </p>
                    </div>

                    {/* Payment */}
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

                  {/* Footer */}
                  <div className="flex flex-col gap-4 border-t border-[#E8E3D5] bg-[#FAF9F5] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                    <div className="text-sm text-gray-500">
                      {order.status === "DELIVERED"
                        ? "Your order has been delivered."
                        : order.status === "CANCELLED"
                        ? "This order has been cancelled."
                        : order.payment?.status === "PAID"
                        ? "Payment completed successfully."
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

          {/* Bottom Shopping CTA */}
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