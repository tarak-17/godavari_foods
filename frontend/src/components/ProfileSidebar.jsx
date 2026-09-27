import {
    FiX,
    FiUser,
    FiMapPin,
    FiPackage,
    FiShoppingCart,
    FiHeart,
    FiSettings,
    FiLogOut,
    FiChevronRight,
  } from "react-icons/fi";
  
  import { NavLink } from "react-router-dom";
  
  const ProfileSidebar = ({
    isOpen,
    onClose,
    onLogout,
  }) => {
    // ==================================================
    // NAVIGATION ITEMS
    // ==================================================
  
    const navigationItems = [
      {
        label: "My Profile",
        description: "View your profile details",
        icon: FiUser,
        path: "/profile",
        enabled: true,
      },
      {
        label: "My Addresses",
        description: "Manage delivery addresses",
        icon: FiMapPin,
        path: "/addresses",
        enabled: true,
      },
      {
        label: "My Orders",
        description: "Track and view your orders",
        icon: FiPackage,
        path: "/orders",
        enabled: true,
      },
      {
        label: "My Cart",
        description: "View items in your cart",
        icon: FiShoppingCart,
        path: "/cart",
        enabled: true,
      },
      {
        label: "Wishlist",
        description: "Your saved products",
        icon: FiHeart,
        path: "/wishlist",
        enabled: false,
      },
      {
        label: "Account Settings",
        description: "Manage account preferences",
        icon: FiSettings,
        path: "/profile/settings",
        enabled: false,
      },
    ];
  
    // ==================================================
    // NAVIGATION CLASS
    // ==================================================
  
    const navigationClass = ({ isActive }) =>
      `group flex w-full items-center gap-4 rounded-xl px-4 py-4 text-left transition-all duration-200 ${
        isActive
          ? "bg-[#F7F2DF] text-[#A88416]"
          : "text-gray-700 hover:bg-[#FAF9F5] hover:text-[#A88416]"
      }`;
  
    return (
      <>
        {/* ================================================= */}
        {/* OVERLAY */}
        {/* ================================================= */}
  
        <div
          className={`fixed inset-0 z-[60] bg-black/30 backdrop-blur-[2px] transition-opacity duration-300 ${
            isOpen
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }`}
          onClick={onClose}
          aria-hidden={!isOpen}
        />
  
        {/* ================================================= */}
        {/* SIDEBAR */}
        {/* ================================================= */}
  
        <aside
          className={`fixed right-0 top-0 z-[70] flex h-screen w-full max-w-md flex-col border-l border-[#E8E3D5] bg-white shadow-2xl transition-transform duration-300 ease-out ${
            isOpen
              ? "translate-x-0"
              : "translate-x-full"
          }`}
          aria-hidden={!isOpen}
        >
          {/* ================================================= */}
          {/* HEADER */}
          {/* ================================================= */}
  
          <div className="flex items-center justify-between border-b border-[#E8E3D5] px-5 py-5 sm:px-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C9A227]">
                Account
              </p>
  
              <h2 className="mt-1 text-xl font-bold text-gray-900">
                My Profile
              </h2>
            </div>
  
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E8E3D5] text-gray-600 transition-all duration-200 hover:border-[#C9A227] hover:text-[#A88416] hover:shadow-sm"
              aria-label="Close profile menu"
            >
              <FiX className="text-xl" />
            </button>
          </div>
  
          {/* ================================================= */}
          {/* PROFILE SUMMARY */}
          {/* ================================================= */}
  
          <div className="border-b border-[#E8E3D5] bg-[#FAF9F5] px-5 py-6 sm:px-6">
            <div className="flex items-center gap-4">
              {/* Avatar */}
  
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full border-2 border-[#C9A227] bg-white shadow-sm">
                <FiUser className="text-2xl text-[#C9A227]" />
              </div>
  
              {/* User information */}
  
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Welcome back
                </p>
  
                <h3 className="mt-1 truncate text-lg font-bold text-gray-900">
                  Your Account
                </h3>
  
                <p className="mt-1 truncate text-sm text-gray-500">
                  Manage your Godavari Foods account
                </p>
              </div>
            </div>
          </div>
  
          {/* ================================================= */}
          {/* NAVIGATION */}
          {/* ================================================= */}
  
          <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-5">
            <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
              Account Menu
            </p>
  
            <div className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
  
                // --------------------------------------------
                // DISABLED ITEMS
                // --------------------------------------------
  
                if (!item.enabled) {
                  return (
                    <div
                      key={item.label}
                      className="flex cursor-not-allowed items-center gap-4 rounded-xl px-4 py-4 opacity-50"
                    >
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-[#E8E3D5] bg-white">
                        <Icon className="text-lg text-gray-500" />
                      </div>
  
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-gray-700">
                            {item.label}
                          </p>
  
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-gray-500">
                            Soon
                          </span>
                        </div>
  
                        <p className="mt-0.5 text-xs text-gray-400">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                }
  
                // --------------------------------------------
                // ACTIVE ITEMS
                // --------------------------------------------
  
                return (
                  <NavLink
                    key={item.label}
                    to={item.path}
                    onClick={onClose}
                    className={navigationClass}
                  >
                    {({ isActive }) => (
                      <>
                        {/* Icon */}
  
                        <div
                          className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border transition-colors duration-200 ${
                            isActive
                              ? "border-[#C9A227] bg-white text-[#C9A227]"
                              : "border-[#E8E3D5] bg-white text-gray-500 group-hover:border-[#C9A227] group-hover:text-[#C9A227]"
                          }`}
                        >
                          <Icon className="text-lg" />
                        </div>
  
                        {/* Text */}
  
                        <div className="min-w-0 flex-1">
                          <p
                            className={`text-sm font-semibold ${
                              isActive
                                ? "text-[#A88416]"
                                : "text-gray-800"
                            }`}
                          >
                            {item.label}
                          </p>
  
                          <p className="mt-0.5 text-xs text-gray-500">
                            {item.description}
                          </p>
                        </div>
  
                        {/* Arrow */}
  
                        <FiChevronRight
                          className={`flex-shrink-0 text-lg transition-transform duration-200 ${
                            isActive
                              ? "text-[#C9A227]"
                              : "text-gray-300 group-hover:translate-x-0.5 group-hover:text-[#C9A227]"
                          }`}
                        />
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
  
          {/* ================================================= */}
          {/* FOOTER / LOGOUT */}
          {/* ================================================= */}
  
          <div className="border-t border-[#E8E3D5] bg-white p-4 sm:p-5">
            <button
              type="button"
              onClick={onLogout}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#E8E3D5] bg-white px-4 py-3.5 text-sm font-semibold text-gray-700 transition-all duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            >
              <FiLogOut className="text-lg" />
  
              Logout
            </button>
  
            <p className="mt-3 text-center text-[11px] text-gray-400">
              Godavari Foods
            </p>
          </div>
        </aside>
      </>
    );
  };
  
  export default ProfileSidebar;