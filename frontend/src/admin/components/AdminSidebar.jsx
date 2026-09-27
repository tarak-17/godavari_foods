import { NavLink, useNavigate } from "react-router-dom";

import {
  FiGrid,
  FiPackage,
  FiTag,
  FiShoppingBag,
  FiUsers,
  FiLogOut,
  FiX,
} from "react-icons/fi";

const AdminSidebar = ({
  isOpen = false,
  onClose = () => {},
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    onClose();

    navigate("/admin/login");
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: FiGrid,
      end: true,
    },
    {
      name: "Products",
      path: "/admin/products",
      icon: FiPackage,
    },
    {
      name: "Categories",
      path: "/admin/categories",
      icon: FiTag,
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: FiShoppingBag,
    },
    {
      name: "Customers",
      path: "/admin/customers",
      icon: FiUsers,
    },
  ];

  return (
    <>
      {/* Mobile overlay */}

      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
        />
      )}

      {/* Sidebar */}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex w-64 flex-col
          border-r border-[#E8E3D5]
          bg-white
          transition-transform duration-300
          lg:translate-x-0
          ${isOpen
            ? "translate-x-0"
            : "-translate-x-full"
          }
        `}
      >

        {/* HEADER */}

        <div className="flex h-20 items-center justify-between border-b border-[#E8E3D5] px-5">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#C9A227] bg-[#F7F2DF]">

              <span className="text-lg font-bold text-[#A88416]">
                G
              </span>

            </div>

            <div>

              <h1 className="text-sm font-bold text-gray-950">
                GODAVARI FOODS
              </h1>

              <p className="text-xs text-[#A88416]">
                Admin Panel
              </p>

            </div>

          </div>

          {/* Mobile close */}

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-[#F7F2DF] hover:text-[#A88416] lg:hidden"
          >
            <FiX size={20} />
          </button>

        </div>

        {/* NAVIGATION */}

        <nav className="flex-1 overflow-y-auto px-3 py-6">

          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Management
          </p>

          <div className="space-y-1">

            {menuItems.map((item) => {

              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `
                    flex items-center gap-3
                    rounded-lg px-3 py-3
                    text-sm font-medium
                    transition-all duration-200
                    ${
                      isActive
                        ? "bg-[#F7F2DF] text-[#A88416]"
                        : "text-gray-600 hover:bg-[#FAF9F5] hover:text-[#A88416]"
                    }
                    `
                  }
                >

                  <Icon size={19} />

                  <span>
                    {item.name}
                  </span>

                </NavLink>
              );
            })}

          </div>

        </nav>

        {/* BOTTOM */}

        <div className="border-t border-[#E8E3D5] p-3">

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-red-50 hover:text-red-600"
          >

            <FiLogOut size={19} />

            <span>
              Logout
            </span>

          </button>

          <p className="mt-4 px-3 pb-2 text-center text-xs text-gray-400">
            © Godavari Foods
          </p>

        </div>

      </aside>
    </>
  );
};

export default AdminSidebar;