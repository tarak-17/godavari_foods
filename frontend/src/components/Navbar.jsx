import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

import {
  FiMenu,
  FiX,
  FiShoppingCart,
  FiPackage,
  FiUser,
  FiHome,
  FiGrid,
} from "react-icons/fi";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-[#E8E3D5] bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="group flex items-center gap-2"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#C9A227]">
            <span className="text-lg font-bold text-[#C9A227]">
              G
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-wide text-black">
              GODAVARI
            </span>

            <span className="text-[10px] font-medium tracking-[0.25em] text-[#C9A227]">
              FOODS
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">

          <NavLink
            to="/"
            className={({ isActive }) =>
              `group flex items-center gap-2 text-sm font-medium transition-colors duration-200 ${
                isActive
                  ? "text-[#C9A227]"
                  : "text-gray-700 hover:text-[#C9A227]"
              }`
            }
          >
            <FiHome className="text-base" />
            Home
          </NavLink>

          <NavLink
            to="/products"
            className={({ isActive }) =>
              `group flex items-center gap-2 text-sm font-medium transition-colors duration-200 ${
                isActive
                  ? "text-[#C9A227]"
                  : "text-gray-700 hover:text-[#C9A227]"
              }`
            }
          >
            <FiGrid className="text-base" />
            Products
          </NavLink>

          <NavLink
            to="/orders"
            className={({ isActive }) =>
              `group flex items-center gap-2 text-sm font-medium transition-colors duration-200 ${
                isActive
                  ? "text-[#C9A227]"
                  : "text-gray-700 hover:text-[#C9A227]"
              }`
            }
          >
            <FiPackage className="text-base" />
            Orders
          </NavLink>
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">

          {/* Cart */}
          <Link
            to="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#E8E3D5] text-gray-700 transition-all duration-200 hover:border-[#C9A227] hover:text-[#C9A227] hover:shadow-sm"
            aria-label="Cart"
          >
            <FiShoppingCart className="text-lg" />
          </Link>

          {/* Login */}
          <Link
            to="/login"
            className="flex items-center gap-2 rounded-lg border border-[#C9A227] px-5 py-2.5 text-sm font-semibold text-[#A88416] transition-all duration-200 hover:bg-[#C9A227] hover:text-white"
          >
            <FiUser />
            Login
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#E8E3D5] text-gray-800 transition-colors duration-200 hover:border-[#C9A227] hover:text-[#C9A227] md:hidden"
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? (
            <FiX className="text-xl" />
          ) : (
            <FiMenu className="text-xl" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`overflow-hidden border-t border-[#E8E3D5] bg-white transition-all duration-200 md:hidden ${
          isMenuOpen
            ? "max-h-[500px] opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">

          {/* Mobile Links */}
          <div className="flex flex-col gap-2">

            <NavLink
              to="/"
              onClick={closeMenu}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? "bg-[#FAF8F0] text-[#A88416]"
                    : "text-gray-700 hover:bg-[#FAF8F0] hover:text-[#A88416]"
                }`
              }
            >
              <FiHome className="text-lg" />
              Home
            </NavLink>

            <NavLink
              to="/products"
              onClick={closeMenu}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? "bg-[#FAF8F0] text-[#A88416]"
                    : "text-gray-700 hover:bg-[#FAF8F0] hover:text-[#A88416]"
                }`
              }
            >
              <FiGrid className="text-lg" />
              Products
            </NavLink>

            <NavLink
              to="/orders"
              onClick={closeMenu}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? "bg-[#FAF8F0] text-[#A88416]"
                    : "text-gray-700 hover:bg-[#FAF8F0] hover:text-[#A88416]"
                }`
              }
            >
              <FiPackage className="text-lg" />
              Orders
            </NavLink>

            <NavLink
              to="/cart"
              onClick={closeMenu}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? "bg-[#FAF8F0] text-[#A88416]"
                    : "text-gray-700 hover:bg-[#FAF8F0] hover:text-[#A88416]"
                }`
              }
            >
              <FiShoppingCart className="text-lg" />
              Cart
            </NavLink>

            <NavLink
              to="/login"
              onClick={closeMenu}
              className={({ isActive }) =>
                `mt-2 flex items-center justify-center gap-2 rounded-lg border border-[#C9A227] px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-[#C9A227] text-white"
                    : "text-[#A88416] hover:bg-[#C9A227] hover:text-white"
                }`
              }
            >
              <FiUser className="text-lg" />
              Login
            </NavLink>

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;