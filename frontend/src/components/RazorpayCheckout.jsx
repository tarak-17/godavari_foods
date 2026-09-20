import { useState } from "react";
import {
  FiCreditCard,
  FiLoader,
  FiShield,
  FiAlertCircle,
} from "react-icons/fi";

import {
  createRazorpayOrder,
  verifyPayment,
} from "../services/paymentService";

const RazorpayCheckout = ({
  orderId,
  token,
  onPaymentSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError("");

      if (!window.Razorpay) {
        throw new Error(
          "Razorpay is not loaded. Please refresh the page and try again."
        );
      }

      const data = await createRazorpayOrder(orderId, token);

      const razorpayOrder = data.razorpayOrder;

      if (!razorpayOrder) {
        throw new Error("Unable to create Razorpay order.");
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,

        amount: razorpayOrder.amount,

        currency: razorpayOrder.currency,

        name: "Godavari Foods",

        description: `Payment for Order #${orderId}`,

        order_id: razorpayOrder.id,

        handler: async function (response) {
          try {
            setLoading(true);
            setError("");

            const result = await verifyPayment(
              orderId,
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature,
              token
            );

            onPaymentSuccess(result.order);
          } catch (error) {
            console.error(
              "Payment verification error:",
              error
            );

            setError(
              error.message ||
                "Payment verification failed."
            );
          } finally {
            setLoading(false);
          }
        },

        prefill: {
          name: "Customer",
        },

        theme: {
          color: "#C9A227",
        },

        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (response) {
        console.error(
          "Razorpay payment failed:",
          response
        );

        setError(
          response.error?.description ||
            "Payment failed. Please try again."
        );

        setLoading(false);
      });

      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);

      setError(
        error.message ||
          "Unable to start payment. Please try again."
      );

      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Pay Now Button */}
      <button
        type="button"
        onClick={handlePayment}
        disabled={loading}
        className="
          flex
          w-full
          items-center
          justify-center
          gap-4
          rounded-2xl
          border-1
          border-[#C9A227]
          bg-white
          px-6
          py-3
          text-[#C9A227]
          transition-all
          duration-200
          hover:bg-[#FFFDF5]
          hover:shadow-md
          disabled:cursor-not-allowed
          disabled:opacity-60
        "
      >
        {loading ? (
          <>
            <FiLoader className="animate-spin text-3xl" />

            <span className="text-2xl font-semibold">
              Processing...
            </span>
          </>
        ) : (
          <>
            <FiCreditCard className="text-4xl" />

            <span className="text-2xl font-semibold">
              Pay Now
            </span>
          </>
        )}
      </button>

      {/* Secure Payment */}
      <div className="mt-5 flex items-center justify-center gap-2 text-sm text-gray-500">
        <FiShield className="text-lg text-[#C9A227]" />

        <span>
          Secure payment powered by Razorpay
        </span>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5">
          <FiAlertCircle className="mt-0.5 shrink-0 text-xl text-red-500" />

          <p className="text-sm leading-6 text-red-700">
            {error}
          </p>
        </div>
      )}
    </div>
  );
};

export default RazorpayCheckout;