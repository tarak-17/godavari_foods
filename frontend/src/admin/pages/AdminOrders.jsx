import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FiShoppingBag,
  FiUser,
  FiMail,
  FiCalendar,
  FiEye,
  FiRefreshCw,
} from "react-icons/fi";

const API_URL = "http://localhost:5050/api";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/admin/orders`,
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
          data.message || "Failed to load orders."
        );
      }

      setOrders(data.data || []);
    } catch (error) {
      console.error(
        "Admin orders error:",
        error
      );

      setError(
        error.message ||
          "Failed to load orders."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
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

  return (
    <div className="space-y-6">

      {/* ========================================= */}
      {/* PAGE HEADER */}
      {/* ========================================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-gray-950">
            Orders
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage customer orders and payments.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchOrders}
          disabled={loading}
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-lg
            border
            border-[#E8E3D5]
            bg-white
            px-4
            py-2.5
            text-sm
            font-medium
            text-gray-700
            transition-all
            duration-200
            hover:border-[#C9A227]
            hover:text-[#A88416]
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          <FiRefreshCw
            size={16}
            className={
              loading
                ? "animate-spin"
                : ""
            }
          />

          Refresh
        </button>

      </div>


      {/* ========================================= */}
      {/* ERROR */}
      {/* ========================================= */}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}


      {/* ========================================= */}
      {/* ORDER COUNT */}
      {/* ========================================= */}

      <div className="rounded-xl border border-[#E8E3D5] bg-white px-5 py-4">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F7F2DF] text-[#A88416]">
            <FiShoppingBag size={19} />
          </div>

          <div>

            <p className="text-xs text-gray-400">
              Total Orders
            </p>

            <p className="text-lg font-bold text-gray-950">
              {loading
                ? "..."
                : orders.length}
            </p>

          </div>

        </div>

      </div>


      {/* ========================================= */}
      {/* ORDERS */}
      {/* ========================================= */}

      <div className="rounded-xl border border-[#E8E3D5] bg-white">

        {/* ========================================= */}
        {/* DESKTOP TABLE */}
        {/* ========================================= */}

        <div className="hidden overflow-x-auto md:block">

          <table className="w-full min-w-[850px]">

            <thead>

              <tr className="border-b border-[#E8E3D5]">

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Order
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Customer
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Date
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Amount
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Status
                </th>

                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {loading ? (

                <tr>

                  <td
                    colSpan="6"
                    className="px-5 py-12 text-center text-sm text-gray-400"
                  >
                    Loading orders...
                  </td>

                </tr>

              ) : orders.length === 0 ? (

                <tr>

                  <td
                    colSpan="6"
                    className="px-5 py-12 text-center"
                  >

                    <FiShoppingBag
                      className="mx-auto text-gray-300"
                      size={32}
                    />

                    <p className="mt-3 text-sm font-medium text-gray-600">
                      No orders found
                    </p>

                  </td>

                </tr>

              ) : (

                orders.map((order) => (

                  <tr
                    key={order.id}
                    className="
                      border-b
                      border-[#E8E3D5]
                      last:border-b-0
                      transition-colors
                      duration-200
                      hover:bg-[#FDFBF4]
                    "
                  >

                    {/* ORDER */}

                    <td className="px-5 py-4">

                      <p className="text-sm font-semibold text-gray-900">
                        #{order.id}
                      </p>

                    </td>


                    {/* CUSTOMER */}

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F7F2DF] text-sm font-semibold text-[#A88416]">

                          {order.user?.name
                            ?.charAt(0)
                            ?.toUpperCase() ||
                            "U"}

                        </div>

                        <div className="min-w-0">

                          <p className="truncate text-sm font-medium text-gray-900">
                            {order.user?.name ||
                              "Unknown"}
                          </p>

                          <p className="truncate text-xs text-gray-400">
                            {order.user?.email ||
                              "-"}
                          </p>

                        </div>

                      </div>

                    </td>


                    {/* DATE */}

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-2 text-sm text-gray-600">

                        <FiCalendar
                          size={15}
                          className="text-[#A88416]"
                        />

                        {formatDate(
                          order.createdAt
                        )}

                      </div>

                    </td>


                    {/* AMOUNT */}

                    <td className="px-5 py-4">

                      <p className="text-sm font-semibold text-gray-900">

                        ₹
                        {Number(
                          order.totalAmount || 0
                        ).toLocaleString(
                          "en-IN"
                        )}

                      </p>

                    </td>


                    {/* STATUS */}

                    <td className="px-5 py-4">

                      <span
                        className={`
                          inline-flex
                          rounded-full
                          px-2.5
                          py-1
                          text-[11px]
                          font-semibold
                          ${getStatusClass(
                            order.status
                          )}
                        `}
                      >
                        {order.status}
                      </span>

                    </td>


                    {/* ACTION */}

                    <td className="px-5 py-4 text-right">

                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/admin/orders/${order.id}`
                          )
                        }
                        className="
                          inline-flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-lg
                          border
                          border-[#E8E3D5]
                          text-gray-500
                          transition-all
                          duration-200
                          hover:border-[#C9A227]
                          hover:bg-[#F7F2DF]
                          hover:text-[#A88416]
                        "
                        title="View order"
                      >
                        <FiEye size={16} />
                      </button>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>


        {/* ========================================= */}
        {/* MOBILE CARDS */}
        {/* ========================================= */}

        <div className="divide-y divide-[#E8E3D5] md:hidden">

          {loading ? (

            <div className="px-5 py-12 text-center text-sm text-gray-400">
              Loading orders...
            </div>

          ) : orders.length === 0 ? (

            <div className="px-5 py-12 text-center">

              <FiShoppingBag
                className="mx-auto text-gray-300"
                size={32}
              />

              <p className="mt-3 text-sm font-medium text-gray-600">
                No orders found
              </p>

            </div>

          ) : (

            orders.map((order) => (

              <div
                key={order.id}
                className="space-y-4 p-5"
              >

                {/* TOP */}

                <div className="flex items-start justify-between gap-4">

                  <div>

                    <p className="text-sm font-bold text-gray-950">
                      Order #{order.id}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {formatDate(
                        order.createdAt
                      )}
                    </p>

                  </div>

                  <span
                    className={`
                      rounded-full
                      px-2.5
                      py-1
                      text-[10px]
                      font-semibold
                      ${getStatusClass(
                        order.status
                      )}
                    `}
                  >
                    {order.status}
                  </span>

                </div>


                {/* CUSTOMER */}

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F7F2DF] text-sm font-semibold text-[#A88416]">

                    {order.user?.name
                      ?.charAt(0)
                      ?.toUpperCase() ||
                      "U"}

                  </div>

                  <div className="min-w-0">

                    <div className="flex items-center gap-2">

                      <FiUser
                        size={13}
                        className="text-[#A88416]"
                      />

                      <p className="truncate text-sm font-medium text-gray-900">
                        {order.user?.name ||
                          "Unknown"}
                      </p>

                    </div>

                    <div className="mt-1 flex items-center gap-2">

                      <FiMail
                        size={13}
                        className="text-gray-400"
                      />

                      <p className="truncate text-xs text-gray-400">
                        {order.user?.email ||
                          "-"}
                      </p>

                    </div>

                  </div>

                </div>


                {/* BOTTOM */}

                <div className="flex items-center justify-between border-t border-[#E8E3D5] pt-4">

                  <div>

                    <p className="text-xs text-gray-400">
                      Order Total
                    </p>

                    <p className="mt-1 text-lg font-bold text-gray-950">

                      ₹
                      {Number(
                        order.totalAmount || 0
                      ).toLocaleString(
                        "en-IN"
                      )}

                    </p>

                  </div>


                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/admin/orders/${order.id}`
                      )
                    }
                    className="
                      inline-flex
                      items-center
                      gap-2
                      rounded-lg
                      border
                      border-[#E8E3D5]
                      px-3
                      py-2
                      text-xs
                      font-medium
                      text-gray-600
                      transition-all
                      duration-200
                      hover:border-[#C9A227]
                      hover:bg-[#F7F2DF]
                      hover:text-[#A88416]
                    "
                  >
                    <FiEye size={14} />
                    View
                  </button>

                </div>

              </div>

            ))

          )}

        </div>

      </div>

    </div>
  );
};

export default AdminOrders;