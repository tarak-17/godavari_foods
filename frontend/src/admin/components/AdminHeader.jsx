import { FiBell, FiMenu } from "react-icons/fi";

const AdminHeader = ({ onMenuClick }) => {
  const getAdminUser = () => {
    try {
      const user = localStorage.getItem("user");

      if (!user) {
        return null;
      }

      return JSON.parse(user);
    } catch (error) {
      console.error(
        "Failed to read admin user:",
        error
      );

      return null;
    }
  };

  const user = getAdminUser();

  const adminName = user?.name || "Admin";

  const firstLetter = adminName
    .charAt(0)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-[#E8E3D5] bg-white px-4 sm:px-6">

      {/* LEFT */}

      <div className="flex items-center gap-3">

        {/* MOBILE MENU */}

        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-gray-600 transition hover:bg-[#F7F2DF] hover:text-[#A88416] lg:hidden"
          aria-label="Open admin menu"
        >
          <FiMenu size={23} />
        </button>

        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
            Admin Panel
          </p>

          <h2 className="text-lg font-bold text-gray-900">
            Welcome back
          </h2>
        </div>

      </div>

      {/* RIGHT */}

      <div className="flex items-center gap-3 sm:gap-5">

        {/* NOTIFICATION */}

        <button
          type="button"
          className="relative rounded-lg p-2 text-gray-500 transition hover:bg-[#F7F2DF] hover:text-[#A88416]"
          aria-label="Notifications"
        >
          <FiBell size={20} />

          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#C9A227]" />
        </button>

        {/* DIVIDER */}

        <div className="hidden h-8 w-px bg-[#E8E3D5] sm:block" />

        {/* ADMIN USER */}

        <div className="flex items-center gap-3">

          <div className="hidden text-right sm:block">

            <p className="text-sm font-semibold text-gray-900">
              {adminName}
            </p>

            <p className="text-xs text-[#A88416]">
              Administrator
            </p>

          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#C9A227] bg-[#F7F2DF]">

            <span className="font-semibold text-[#A88416]">
              {firstLetter}
            </span>

          </div>

        </div>

      </div>

    </header>
  );
};

export default AdminHeader;