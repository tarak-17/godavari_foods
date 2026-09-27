import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  FiArrowLeft,
  FiMail,
  FiMapPin,
  FiPackage,
  FiCreditCard,
  FiCalendar,
  FiShoppingBag,
} from "react-icons/fi";

const API_URL = "http://localhost:5050/api";

const AdminOrderDetails = () => {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedStatus, setSelectedStatus] =
    useState("");

  const [updatingStatus, setUpdatingStatus] =
    useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const token =
          localStorage.getItem("token");

        const response = await fetch(
          `${API_URL}/admin/orders/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to load order."
          );
        }

        setOrder(data.data);
        setSelectedStatus(data.data.status);
      } catch (error) {
        console.error(
          "Order details error:",
          error
        );

        setError(
          error.message ||
            "Failed to load order."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-50 text-green-600";

      case "DELIVERED":
        return "bg-blue-50 text-blue-600";

      case "CANCELLED":
        return "bg-red-50 text-red-600";

      case "SHIPPED":
        return "bg-purple-50 text-purple-600";

      case "PENDING":
        return "bg-yellow-50 text-yellow-600";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const updateOrderStatus = async () => {
    if (!order) return;

    if (selectedStatus === order.status) {
      return;
    }

    try {
      setUpdatingStatus(true);
      setError("");

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/admin/orders/${order.id}/status`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            status: selectedStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update order status."
        );
      }

      setOrder((previousOrder) => ({
        ...previousOrder,
        status: data.data.status,
        updatedAt: data.data.updatedAt,
      }));

      setSelectedStatus(data.data.status);
    } catch (error) {
      console.error(
        "Update order status error:",
        error
      );

      setError(
        error.message ||
          "Failed to update order status."
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-gray-400">
          Loading order...
        </p>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="space-y-5">

        <Link
          to="/admin/orders"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-[#A88416]"
        >
          <FiArrowLeft size={16} />
          Back to Orders
        </Link>

        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
          {error}
        </div>

      </div>
    );
  }

  if (!order) {
    return (
      <div className="space-y-5">

        <Link
          to="/admin/orders"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-[#A88416]"
        >
          <FiArrowLeft size={16} />
          Back to Orders
        </Link>

        <div className="rounded-xl border border-[#E8E3D5] bg-white px-5 py-12 text-center">

          <FiShoppingBag
            className="mx-auto text-gray-300"
            size={34}
          />

          <p className="mt-3 text-sm font-medium text-gray-600">
            Order not found
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ========================================= */}
      {/* HEADER */}
      {/* ========================================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <Link
            to="/admin/orders"
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-[#A88416]"
          >
            <FiArrowLeft size={16} />
            Back to Orders
          </Link>

          <div className="flex flex-wrap items-center gap-3">

            <h1 className="text-2xl font-bold text-gray-950">
              Order #{order.id}
            </h1>

            <span
              className={`
                rounded-full
                px-3
                py-1
                text-xs
                font-semibold
                ${getStatusClass(order.status)}
              `}
            >
              {order.status}
            </span>

          </div>

          <p className="mt-1 text-sm text-gray-500">
            Placed on{" "}
            {formatDate(order.createdAt)}
          </p>

        </div>

      </div>


      {/* ========================================= */}
      {/* ORDER STATUS */}
      {/* ========================================= */}

      <div className="rounded-xl border border-[#E8E3D5] bg-white">

        <div className="border-b border-[#E8E3D5] px-5 py-4">

          <h2 className="font-semibold text-gray-950">
            Order Status
          </h2>

          <p className="mt-1 text-xs text-gray-400">
            Update the current status of this order.
          </p>

        </div>

        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-end">

          <div className="w-full sm:max-w-xs">

            <label
              htmlFor="order-status"
              className="mb-2 block text-xs font-medium text-gray-500"
            >
              Status
            </label>

            <select
              id="order-status"
              value={selectedStatus}
              onChange={(event) =>
                setSelectedStatus(
                  event.target.value
                )
              }
              disabled={updatingStatus}
              className="
                w-full
                rounded-lg
                border
                border-[#E8E3D5]
                bg-white
                px-3
                py-2.5
                text-sm
                text-gray-800
                outline-none
                transition-all
                duration-200
                focus:border-[#C9A227]
                focus:ring-2
                focus:ring-[#C9A227]/10
                disabled:cursor-not-allowed
                disabled:bg-gray-50
              "
            >
              <option value="PENDING">
                Pending
              </option>

              <option value="CONFIRMED">
                Confirmed
              </option>

              <option value="SHIPPED">
                Shipped
              </option>

              <option value="DELIVERED">
                Delivered
              </option>

              <option value="CANCELLED">
                Cancelled
              </option>
            </select>

          </div>


          <button
            type="button"
            onClick={updateOrderStatus}
            disabled={
              updatingStatus ||
              selectedStatus === order.status
            }
            className="
              inline-flex
              items-center
              justify-center
              rounded-lg
              bg-[#C9A227]
              px-5
              py-2.5
              text-sm
              font-semibold
              text-white
              transition-all
              duration-200
              hover:bg-[#A88416]
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {updatingStatus
              ? "Updating..."
              : "Update Status"}
          </button>

        </div>

      </div>


      {/* ========================================= */}
      {/* STATUS UPDATE ERROR */}
      {/* ========================================= */}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}


      {/* ========================================= */}
      {/* CUSTOMER + PAYMENT */}
      {/* ========================================= */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* CUSTOMER */}

        <div className="rounded-xl border border-[#E8E3D5] bg-white">

          <div className="border-b border-[#E8E3D5] px-5 py-4">

            <h2 className="font-semibold text-gray-950">
              Customer
            </h2>

          </div>

          <div className="space-y-4 p-5">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F7F2DF] font-semibold text-[#A88416]">
                {order.user?.name
                  ?.charAt(0)
                  ?.toUpperCase() || "U"}
              </div>

              <div>

                <p className="text-sm font-semibold text-gray-900">
                  {order.user?.name ||
                    "Unknown Customer"}
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Customer ID:{" "}
                  {order.user?.id || "-"}
                </p>

              </div>

            </div>

            <div className="flex items-center gap-3 text-sm text-gray-600">

              <FiMail
                size={16}
                className="text-[#A88416]"
              />

              {order.user?.email || "-"}

            </div>

          </div>

        </div>


        {/* PAYMENT */}

        <div className="rounded-xl border border-[#E8E3D5] bg-white">

          <div className="border-b border-[#E8E3D5] px-5 py-4">

            <h2 className="font-semibold text-gray-950">
              Payment
            </h2>

          </div>

          <div className="space-y-4 p-5">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#F7F2DF] text-[#A88416]">
                <FiCreditCard size={20} />
              </div>

              <div>

                <p className="text-sm font-semibold text-gray-900">
                  Payment Information
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  {order.payment
                    ? "Payment record available"
                    : "No payment record"}
                </p>

              </div>

            </div>

            {order.payment && (
              <div className="rounded-lg bg-[#FAF9F5] p-4">

                <p className="text-xs text-gray-400">
                  Payment ID
                </p>

                <p className="mt-1 break-all text-sm font-medium text-gray-800">
                  {order.payment.id || "-"}
                </p>

              </div>
            )}

          </div>

        </div>

      </div>


      {/* ========================================= */}
      {/* DELIVERY ADDRESS */}
      {/* ========================================= */}

      <div className="rounded-xl border border-[#E8E3D5] bg-white">

        <div className="border-b border-[#E8E3D5] px-5 py-4">

          <h2 className="font-semibold text-gray-950">
            Delivery Address
          </h2>

        </div>

        <div className="p-5">

          <div className="flex items-start gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F7F2DF] text-[#A88416]">
              <FiMapPin size={19} />
            </div>

            <div className="text-sm leading-6 text-gray-600">

              {order.address ? (
                <>

                  {order.address.name && (
                    <p className="font-semibold text-gray-900">
                      {order.address.name}
                    </p>
                  )}

                  {order.address.addressLine1 && (
                    <p>
                      {order.address.addressLine1}
                    </p>
                  )}

                  {order.address.addressLine2 && (
                    <p>
                      {order.address.addressLine2}
                    </p>
                  )}

                  {(order.address.city ||
                    order.address.state ||
                    order.address.pincode) && (
                    <p>
                      {[
                        order.address.city,
                        order.address.state,
                        order.address.pincode,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  )}

                  {order.address.phone && (
                    <p className="mt-2">
                      Phone:{" "}
                      {order.address.phone}
                    </p>
                  )}

                </>
              ) : (
                <p>
                  Delivery address not available.
                </p>
              )}

            </div>

          </div>

        </div>

      </div>


      {/* ========================================= */}
      {/* ORDER ITEMS */}
      {/* ========================================= */}

      <div className="rounded-xl border border-[#E8E3D5] bg-white">

        <div className="flex items-center gap-3 border-b border-[#E8E3D5] px-5 py-4">

          <FiPackage
            className="text-[#A88416]"
            size={19}
          />

          <h2 className="font-semibold text-gray-950">
            Order Items
          </h2>

        </div>


        <div className="divide-y divide-[#E8E3D5]">

          {order.items?.length > 0 ? (
            order.items.map((item) => {

              const itemPrice = Number(
                item.variant?.price ||
                  item.price ||
                  0
              );

              const quantity = Number(
                item.quantity || 0
              );

              const itemTotal =
                itemPrice * quantity;

              return (
                <div
                  key={item.id}
                  className="
                    flex
                    flex-col
                    gap-4
                    px-5
                    py-5
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                  "
                >

                  <div className="flex items-start gap-4">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#F7F2DF] text-[#A88416]">
                      <FiPackage size={20} />
                    </div>

                    <div>

                      <p className="text-sm font-semibold text-gray-900">
                        {item.product?.name ||
                          "Product"}
                      </p>

                      {item.variant?.quantity && (
                        <p className="mt-1 text-xs text-gray-400">
                          Variant:{" "}
                          {item.variant.quantity}
                        </p>
                      )}

                      <p className="mt-1 text-xs text-gray-400">
                        Quantity: {quantity}
                      </p>

                    </div>

                  </div>


                  <div className="text-left sm:text-right">

                    <p className="text-sm text-gray-500">
                      ₹
                      {itemPrice.toLocaleString(
                        "en-IN"
                      )}{" "}
                      × {quantity}
                    </p>

                    <p className="mt-1 text-base font-bold text-gray-900">
                      ₹
                      {itemTotal.toLocaleString(
                        "en-IN"
                      )}
                    </p>

                  </div>

                </div>
              );
            })
          ) : (
            <div className="px-5 py-10 text-center text-sm text-gray-400">
              No order items found.
            </div>
          )}

        </div>


        {/* TOTAL */}

        <div className="border-t border-[#E8E3D5] bg-[#FAF9F5] px-5 py-5">

          <div className="flex items-center justify-between">

            <span className="text-sm font-semibold text-gray-600">
              Order Total
            </span>

            <span className="text-xl font-bold text-gray-950">
              ₹
              {Number(
                order.totalAmount || 0
              ).toLocaleString("en-IN")}
            </span>

          </div>

        </div>

      </div>


      {/* ========================================= */}
      {/* ORDER INFORMATION */}
      {/* ========================================= */}

      <div className="rounded-xl border border-[#E8E3D5] bg-white">

        <div className="border-b border-[#E8E3D5] px-5 py-4">

          <h2 className="font-semibold text-gray-950">
            Order Information
          </h2>

        </div>

        <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2">

          <div className="flex items-center gap-3">

            <FiCalendar
              className="text-[#A88416]"
              size={18}
            />

            <div>

              <p className="text-xs text-gray-400">
                Created
              </p>

              <p className="mt-1 text-sm font-medium text-gray-800">
                {formatDate(order.createdAt)}
              </p>

            </div>

          </div>


          <div className="flex items-center gap-3">

            <FiCalendar
              className="text-[#A88416]"
              size={18}
            />

            <div>

              <p className="text-xs text-gray-400">
                Last Updated
              </p>

              <p className="mt-1 text-sm font-medium text-gray-800">
                {formatDate(order.updatedAt)}
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default AdminOrderDetails;