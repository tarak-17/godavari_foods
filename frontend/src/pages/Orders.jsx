import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiClock,
  FiCreditCard,
  FiLoader,
  FiPackage,
  FiShoppingBag,
  FiAlertCircle,
} from "react-icons/fi";

import { getOrderById } from "../services/orderService";
import RazorpayCheckout from "../components/RazorpayCheckout";
import { createPayment } from "../services/paymentService";
import Navbar from "../components/Navbar";

const Orders = () => {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creatingPayment, setCreatingPayment] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrder = async () => {
      if (!token) {
        setError("Please login to view this order.");
        setLoading(false);
        return;
      }

      try {
        setError("");

        const data = await getOrderById(id, token);

        setOrder(data.order);
      } catch (error) {
        console.error("Fetch order error:", error);

        setError(error.message || "Failed to fetch order.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, token]);

  const handleCreatePayment = async () => {
    if (!order) return;

    try {
      setError("");
      setCreatingPayment(true);

      const data = await createPayment(order.id, token);

      console.log("Payment created:", data);

      setOrder((previousOrder) => ({
        ...previousOrder,
        payment: data.payment,
      }));
    } catch (error) {
      console.error("Create payment error:", error);

      setError(error.message || "Failed to create payment.");
    } finally {
      setCreatingPayment(false);
    }
  };

  const handlePaymentSuccess = (updatedOrder) => {
    setOrder((previousOrder) => ({
      ...previousOrder,
      ...updatedOrder,
      payment: {
        ...previousOrder.payment,
        status: "PAID",
      },
    }));
  };

  const formatPrice = (price) => {
    return Number(price).toLocaleString("en-IN");
  };

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "border-green-200 bg-green-50 text-green-700";

      case "PENDING":
        return "border-yellow-200 bg-yellow-50 text-yellow-700";

      case "CANCELLED":
        return "border-red-200 bg-red-50 text-red-700";

      case "SHIPPED":
        return "border-blue-200 bg-blue-50 text-blue-700";

      case "DELIVERED":
        return "border-green-200 bg-green-50 text-green-700";

      default:
        return "border-gray-200 bg-gray-50 text-gray-700";
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="flex min-h-[70vh] items-center justify-center bg-[#FAF9F5] px-4">
          <div className="flex flex-col items-center text-center">
            <FiLoader className="animate-spin text-4xl text-[#C9A227]" />

            <p className="mt-4 text-sm text-gray-600">
              Loading your order...
            </p>
          </div>
        </main>
      </>
    );
  }

  if (error && !order) {
    return (
      <>
        <Navbar />

        <main className="flex min-h-[70vh] items-center justify-center bg-[#FAF9F5] px-4">
          <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
              <FiAlertCircle className="text-2xl text-red-500" />
            </div>

            <h1 className="mt-5 text-xl font-bold text-gray-900">
              Unable to load order
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              {error}
            </p>

            <Link
              to="/orders"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#C9A227] px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#A88416]"
            >
              <FiArrowLeft />
              Back to Orders
            </Link>
          </div>
        </main>
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Navbar />

        <main className="flex min-h-[70vh] items-center justify-center bg-[#FAF9F5] px-4">
          <div className="text-center">
            <FiPackage className="mx-auto text-5xl text-[#C9A227]" />

            <h1 className="mt-4 text-xl font-bold text-gray-900">
              Order not found
            </h1>

            <Link
              to="/orders"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#A88416] hover:underline"
            >
              <FiArrowLeft />
              Back to Orders
            </Link>
          </div>
        </main>
      </>
    );
  }

  const isPending = order.status === "PENDING";
  const isPaid = order.payment?.status === "PAID";

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#FAF9F5] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Back */}
          <Link
            to="/orders"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition-colors duration-200 hover:text-[#A88416]"
          >
            <FiArrowLeft />
            Back to Orders
          </Link>

          {/* Header */}
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-[#A88416]">
                Order Details
              </p>

              <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
                Order #{order.id}
              </h1>

              {order.createdAt && (
                <p className="mt-2 text-sm text-gray-500">
                  Placed on {formatDate(order.createdAt)}
                </p>
              )}
            </div>

            <span
              className={`inline-flex w-fit items-center rounded-full border px-4 py-2 text-sm font-semibold ${getStatusStyle(
                order.status
              )}`}
            >
              {order.status}
            </span>
          </div>

          {/* Payment success */}
          {order.status === "CONFIRMED" && isPaid && (
            <div className="mt-6 flex items-start gap-4 rounded-2xl border border-green-200 bg-green-50 p-5">
              <FiCheckCircle className="mt-0.5 shrink-0 text-2xl text-green-600" />

              <div>
                <h2 className="font-semibold text-green-800">
                  Payment successful
                </h2>

                <p className="mt-1 text-sm leading-6 text-green-700">
                  Your payment has been received and your order has been
                  confirmed successfully.
                </p>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
              <FiAlertCircle className="mt-0.5 shrink-0 text-red-500" />

              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
            {/* Left */}
            <div className="space-y-6">
              {/* Order summary */}
              <section className="rounded-2xl border border-[#E8E3D5] bg-white shadow-sm">
                <div className="border-b border-[#E8E3D5] p-5 sm:p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F7F2DF]">
                      <FiShoppingBag className="text-xl text-[#A88416]" />
                    </div>

                    <div>
                      <h2 className="font-bold text-gray-900">
                        Order Summary
                      </h2>

                      <p className="text-sm text-gray-500">
                        Your order information
                      </p>
                    </div>
                  </div>
                </div>

                <div className="divide-y divide-[#E8E3D5]">
                  <div className="flex items-center justify-between p-5 sm:p-6">
                    <span className="text-sm text-gray-500">
                      Order ID
                    </span>

                    <span className="font-semibold text-gray-900">
                      #{order.id}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-5 sm:p-6">
                    <span className="text-sm text-gray-500">
                      Order Status
                    </span>

                    <span className="font-semibold text-gray-900">
                      {order.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-5 sm:p-6">
                    <span className="text-sm text-gray-500">
                      Total Amount
                    </span>

                    <span className="text-xl font-bold text-[#A88416]">
                      ₹{formatPrice(order.totalAmount)}
                    </span>
                  </div>
                </div>
              </section>

              {/* Payment information */}
              <section className="rounded-2xl border border-[#E8E3D5] bg-white shadow-sm">
                <div className="border-b border-[#E8E3D5] p-5 sm:p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F7F2DF]">
                      <FiCreditCard className="text-xl text-[#A88416]" />
                    </div>

                    <div>
                      <h2 className="font-bold text-gray-900">
                        Payment Information
                      </h2>

                      <p className="text-sm text-gray-500">
                        Payment details for this order
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  {order.payment ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          Payment Status
                        </span>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            order.payment.status === "PAID"
                              ? "bg-green-50 text-green-700"
                              : "bg-yellow-50 text-yellow-700"
                          }`}
                        >
                          {order.payment.status}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          Payment Method
                        </span>

                        <span className="font-medium text-gray-900">
                          {order.payment.method || "Online Payment"}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl bg-[#FAF9F5] p-4">
                      <div className="flex items-start gap-3">
                        <FiClock className="mt-0.5 shrink-0 text-[#C9A227]" />

                        <div>
                          <p className="font-medium text-gray-900">
                            Payment pending
                          </p>

                          <p className="mt-1 text-sm leading-6 text-gray-600">
                            Start the payment process to complete your order.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* Right */}
            <aside className="h-fit lg:sticky lg:top-24">
              <section className="rounded-2xl border border-[#E8E3D5] bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900">
                  Payment
                </h2>

                <div className="mt-5 flex items-center justify-between border-b border-[#E8E3D5] pb-5">
                  <span className="text-sm text-gray-500">
                    Order Total
                  </span>

                  <span className="text-xl font-bold text-[#A88416]">
                    ₹{formatPrice(order.totalAmount)}
                  </span>
                </div>

                {/* Start payment */}
                {isPending && !order.payment && (
                  <button
                    type="button"
                    onClick={handleCreatePayment}
                    disabled={creatingPayment}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#C9A227] px-5 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#A88416] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {creatingPayment ? (
                      <>
                        <FiLoader className="animate-spin" />
                        Preparing Payment...
                      </>
                    ) : (
                      <>
                        <FiCreditCard />
                        Start Payment
                      </>
                    )}
                  </button>
                )}

                {/* Razorpay */}
                {isPending && order.payment && !isPaid && (
                  <div className="mt-5">
                    <RazorpayCheckout
                      orderId={order.id}
                      token={token}
                      onPaymentSuccess={handlePaymentSuccess}
                    />
                  </div>
                )}

                {/* Already paid */}
                {isPaid && (
                  <div className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3.5 text-sm font-semibold text-green-700">
                    <FiCheckCircle />
                    Payment Completed
                  </div>
                )}

                <div className="mt-6 border-t border-[#E8E3D5] pt-5">
                  <div className="flex items-start gap-3">
                    <FiCheckCircle className="mt-0.5 shrink-0 text-[#C9A227]" />

                    <p className="text-xs leading-5 text-gray-500">
                      Your payment is securely processed through Razorpay.
                    </p>
                  </div>
                </div>
              </section>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
};

export default Orders;