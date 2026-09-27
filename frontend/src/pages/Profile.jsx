import { useState } from "react";

import {
  FiUser,
  FiMail,
  FiPhone,
  FiEdit3,
  FiMapPin,
  FiArrowLeft,
} from "react-icons/fi";

import { Link } from "react-router-dom";

const Profile = () => {
  // --------------------------------------------
  // Temporary user information
  // --------------------------------------------
  // We will connect this to PostgreSQL later.
  // --------------------------------------------

  const [user, setUser] = useState({
    name: "Tarak",
    email: "tarak@example.com",
    phone: "9876543210",
  });

  // --------------------------------------------
  // Edit state
  // --------------------------------------------

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
  });

  // --------------------------------------------
  // Handle input changes
  // --------------------------------------------

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // --------------------------------------------
  // Save profile
  // --------------------------------------------

  const handleSave = () => {
    setUser({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
    });

    setIsEditing(false);
  };

  // --------------------------------------------
  // Cancel editing
  // --------------------------------------------

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
    });

    setIsEditing(false);
  };

  // --------------------------------------------
  // User initial
  // --------------------------------------------

  const userInitial =
    user.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <main className="min-h-screen bg-[#FAF9F5] px-4 py-8 pb-24 sm:px-6 md:pb-8 lg:px-8">

      <div className="mx-auto max-w-4xl">

        {/* ==========================================
            BACK BUTTON
        ========================================== */}

        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors duration-200 hover:text-[#A88416]"
        >
          <FiArrowLeft />

          Back to Home
        </Link>

        {/* ==========================================
            PAGE HEADER
        ========================================== */}

        <div className="mb-8">

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#C9A227]">
            Account
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
            My Profile
          </h1>

          <p className="mt-2 text-gray-500">
            View and manage your personal information.
          </p>

        </div>

        {/* ==========================================
            PROFILE CARD
        ========================================== */}

        <div className="overflow-hidden rounded-2xl border border-[#E8E3D5] bg-white shadow-sm">

          {/* ========================================
              PROFILE HEADER
          ======================================== */}

          <div className="border-b border-[#E8E3D5] bg-[#FAF9F5] px-6 py-8 sm:px-8">

            <div className="flex flex-col items-center gap-5 sm:flex-row">

              {/* Avatar */}

              <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-full border-2 border-[#C9A227] bg-white text-3xl font-bold text-[#A88416] shadow-sm">
                {userInitial}
              </div>

              {/* Name */}

              <div className="text-center sm:text-left">

                <h2 className="text-2xl font-bold text-gray-900">
                  {user.name}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Godavari Foods Customer
                </p>

              </div>

            </div>

          </div>

          {/* ========================================
              PROFILE CONTENT
          ======================================== */}

          <div className="p-6 sm:p-8">

            {!isEditing ? (
              <>
                {/* ==================================
                    INFORMATION GRID
                ================================== */}

                <div className="grid gap-5 sm:grid-cols-2">

                  {/* NAME */}

                  <div className="rounded-xl border border-[#E8E3D5] bg-white p-5 transition-all duration-200 hover:border-[#C9A227]">

                    <div className="flex items-center gap-3">

                      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-[#F7F2DF]">
                        <FiUser className="text-lg text-[#C9A227]" />
                      </div>

                      <div className="min-w-0">

                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                          Full Name
                        </p>

                        <p className="mt-1 truncate text-sm font-semibold text-gray-800">
                          {user.name}
                        </p>

                      </div>

                    </div>

                  </div>

                  {/* EMAIL */}

                  <div className="rounded-xl border border-[#E8E3D5] bg-white p-5 transition-all duration-200 hover:border-[#C9A227]">

                    <div className="flex items-center gap-3">

                      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-[#F7F2DF]">
                        <FiMail className="text-lg text-[#C9A227]" />
                      </div>

                      <div className="min-w-0">

                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                          Email
                        </p>

                        <p className="mt-1 truncate text-sm font-semibold text-gray-800">
                          {user.email}
                        </p>

                      </div>

                    </div>

                  </div>

                  {/* PHONE */}

                  <div className="rounded-xl border border-[#E8E3D5] bg-white p-5 transition-all duration-200 hover:border-[#C9A227]">

                    <div className="flex items-center gap-3">

                      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-[#F7F2DF]">
                        <FiPhone className="text-lg text-[#C9A227]" />
                      </div>

                      <div className="min-w-0">

                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                          Phone
                        </p>

                        <p className="mt-1 truncate text-sm font-semibold text-gray-800">
                          {user.phone}
                        </p>

                      </div>

                    </div>

                  </div>

                  {/* ADDRESS */}

                  <Link
                    to="/addresses"
                    className="rounded-xl border border-[#E8E3D5] bg-white p-5 transition-all duration-200 hover:border-[#C9A227]"
                  >

                    <div className="flex items-center gap-3">

                      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-[#F7F2DF]">
                        <FiMapPin className="text-lg text-[#C9A227]" />
                      </div>

                      <div className="min-w-0">

                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                          Addresses
                        </p>

                        <p className="mt-1 text-sm font-semibold text-gray-800">
                          Manage delivery addresses
                        </p>

                      </div>

                    </div>

                  </Link>

                </div>

                {/* ==================================
                    EDIT BUTTON
                ================================== */}

                <div className="mt-8 border-t border-[#E8E3D5] pt-6">

                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#C9A227] px-5 py-3 text-sm font-semibold text-[#A88416] transition-all duration-200 hover:bg-[#C9A227] hover:text-white"
                  >
                    <FiEdit3 />

                    Edit Profile
                  </button>

                </div>
              </>
            ) : (
              /* ====================================
                 EDIT FORM
              ==================================== */

              <div>

                <h2 className="text-xl font-bold text-gray-900">
                  Edit Profile
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Update your personal information.
                </p>

                <div className="mt-6 space-y-5">

                  {/* NAME */}

                  <div>

                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                      Full Name
                    </label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-[#E8E3D5] bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-all duration-200 focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/10"
                    />

                  </div>

                  {/* EMAIL */}

                  <div>

                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                      Email
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-[#E8E3D5] bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-all duration-200 focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/10"
                    />

                  </div>

                  {/* PHONE */}

                  <div>

                    <label
                      htmlFor="phone"
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                      Phone
                    </label>

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-[#E8E3D5] bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-all duration-200 focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/10"
                    />

                  </div>

                </div>

                {/* ==================================
                    ACTION BUTTONS
                ================================== */}

                <div className="mt-8 flex flex-wrap gap-3 border-t border-[#E8E3D5] pt-6">

                  <button
                    type="button"
                    onClick={handleSave}
                    className="rounded-xl bg-[#C9A227] px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#A88416]"
                  >
                    Save Changes
                  </button>

                  <button
                    type="button"
                    onClick={handleCancel}
                    className="rounded-xl border border-[#E8E3D5] px-6 py-3 text-sm font-semibold text-gray-700 transition-all duration-200 hover:border-[#C9A227] hover:text-[#A88416]"
                  >
                    Cancel
                  </button>

                </div>

              </div>
            )}

          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;