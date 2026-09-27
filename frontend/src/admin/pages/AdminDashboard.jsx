import { useEffect, useState } from "react";
import {
  FiBox,
  FiShoppingBag,
  FiUsers,
  FiDollarSign,
  FiArrowUpRight,
} from "react-icons/fi";

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    recentOrders: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5050/api/admin/dashboard",
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
            data.message || "Failed to load dashboard data."
          );
        }

        setDashboardData({
          totalProducts: data.data?.totalProducts || 0,
          totalOrders: data.data?.totalOrders || 0,
          totalCustomers: data.data?.totalCustomers || 0,
          totalRevenue: Number(data.data?.totalRevenue || 0),
          recentOrders: data.data?.recentOrders || [],
        });
      } catch (error) {
        console.error("Dashboard error:", error);

        setError(
          error.message || "Failed to load dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = [
    {
      title: "Total Products",
      value: loading ? "..." : dashboardData.totalProducts,
      description: "Products in your store",
      icon: FiBox,
    },
    {
      title: "Total Orders",
      value: loading ? "..." : dashboardData.totalOrders,
      description: "Orders received",
      icon: FiShoppingBag,
    },
    {
      title: "Customers",
      value: loading ? "..." : dashboardData.totalCustomers,
      description: "Registered customers",
      icon: FiUsers,
    },
    {
      title: "Revenue",
      value: loading
        ? "..."
        : `₹${dashboardData.totalRevenue.toLocaleString(
            "en-IN"
          )}`,
      description: "Total store revenue",
      icon: FiDollarSign,
    },
  ];

  return (
    <div className="space-y-6">

      {/* PAGE HEADER */}

      <div>
        <h1 className="text-2xl font-bold text-gray-950">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Overview of your Godavari Foods store.
        </p>
      </div>


      {/* ERROR */}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}


      {/* STAT CARDS */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-xl border border-[#E8E3D5] bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between">

                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {stat.title}
                  </p>

                  <p className="mt-2 text-2xl font-bold text-gray-950">
                    {stat.value}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#F7F2DF] text-[#A88416]">
                  <Icon size={21} />
                </div>

              </div>

              <p className="mt-4 text-xs text-gray-400">
                {stat.description}
              </p>
            </div>
          );
        })}

      </div>


      {/* LOWER SECTION */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">


        {/* RECENT ORDERS */}

        <div className="rounded-xl border border-[#E8E3D5] bg-white">

          <div className="flex items-center justify-between border-b border-[#E8E3D5] px-5 py-4">

            <div>
              <h2 className="font-semibold text-gray-950">
                Recent Orders
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                Latest orders from customers
              </p>
            </div>

            <FiArrowUpRight
              className="text-[#A88416]"
              size={20}
            />

          </div>


          {/* ORDERS */}

          {loading ? (
            <div className="flex min-h-48 items-center justify-center">
              <p className="text-sm text-gray-400">
                Loading orders...
              </p>
            </div>
          ) : dashboardData.recentOrders.length === 0 ? (
            <div className="flex min-h-48 items-center justify-center px-5">

              <div className="text-center">

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F7F2DF] text-[#A88416]">
                  <FiShoppingBag size={21} />
                </div>

                <p className="mt-3 text-sm font-medium text-gray-700">
                  No orders yet
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  New customer orders will appear here.
                </p>

              </div>

            </div>
          ) : (
            <div className="divide-y divide-[#E8E3D5]">

              {dashboardData.recentOrders.map((order) => (

                <div
                  key={order.id}
                  className="flex items-center justify-between gap-4 px-5 py-4 transition-colors duration-200 hover:bg-[#FDFBF4]"
                >

                  {/* CUSTOMER */}

                  <div className="min-w-0">

                    <p className="truncate text-sm font-semibold text-gray-900">
                      {order.user?.name || "Unknown Customer"}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      Order #{order.id}
                    </p>

                  </div>


                  {/* RIGHT SIDE */}

                  <div className="text-right">

                    <p className="text-sm font-semibold text-gray-900">
                      ₹
                      {Number(
                        order.totalAmount || 0
                      ).toLocaleString("en-IN")}
                    </p>

                    <span
                      className={`mt-1 inline-block rounded-full px-2 py-1 text-[10px] font-semibold ${
                        order.status === "CONFIRMED"
                          ? "bg-green-50 text-green-600"
                          : order.status === "CANCELLED"
                          ? "bg-red-50 text-red-600"
                          : "bg-yellow-50 text-yellow-600"
                      }`}
                    >
                      {order.status}
                    </span>

                  </div>

                </div>

              ))}

            </div>
          )}

        </div>


        {/* QUICK ACTIONS */}

        <div className="rounded-xl border border-[#E8E3D5] bg-white">

          <div className="border-b border-[#E8E3D5] px-5 py-4">

            <h2 className="font-semibold text-gray-950">
              Quick Actions
            </h2>

            <p className="mt-1 text-xs text-gray-400">
              Manage your store quickly
            </p>

          </div>


          <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2">

            {/* ADD PRODUCT */}

            <button
              type="button"
              className="rounded-lg border border-[#E8E3D5] px-4 py-4 text-left transition-all duration-200 hover:border-[#C9A227] hover:bg-[#F7F2DF]"
            >
              <FiBox
                className="text-[#A88416]"
                size={21}
              />

              <p className="mt-3 text-sm font-semibold text-gray-900">
                Add Product
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Add a new product
              </p>
            </button>


            {/* VIEW ORDERS */}

            <button
              type="button"
              className="rounded-lg border border-[#E8E3D5] px-4 py-4 text-left transition-all duration-200 hover:border-[#C9A227] hover:bg-[#F7F2DF]"
            >
              <FiShoppingBag
                className="text-[#A88416]"
                size={21}
              />

              <p className="mt-3 text-sm font-semibold text-gray-900">
                View Orders
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Manage customer orders
              </p>
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;