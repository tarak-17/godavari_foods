import { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const token = localStorage.getItem("token");

  const user = (() => {
    try {
      const storedUser =
        localStorage.getItem("user");

      return storedUser
        ? JSON.parse(storedUser)
        : null;
    } catch {
      return null;
    }
  })();

  /*
   * Protect the admin area.
   */
  if (!token) {
    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );
  }

  /*
   * Only ADMIN users can access
   * the admin application.
   */
  if (
    !user ||
    String(user.role).toUpperCase() !==
      "ADMIN"
  ) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F5]">

      {/* SIDEBAR */}

      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() =>
          setSidebarOpen(false)
        }
      />

      {/* MAIN */}

      <div className="lg:pl-64">

        <AdminHeader
          onMenuClick={() =>
            setSidebarOpen(true)
          }
        />

        <main className="min-h-[calc(100vh-80px)] p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default AdminLayout;