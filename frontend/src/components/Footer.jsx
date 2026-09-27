import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiFacebook,
  FiInstagram,
  FiMail,
  FiMapPin,
  FiPhone,
} from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="border-t border-[#E8E3D5] bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-3"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#C9A227] text-lg font-bold text-white">
                G
              </span>

              <span className="text-xl font-bold text-gray-900">
                Godavari Foods
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-6 text-gray-600">
              Authentic traditional foods made with care, bringing
              the rich flavours of the Godavari region to your home.
            </p>

            <Link
              to="/products"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#A88416] transition-colors duration-200 hover:text-[#806510]"
            >
              Explore Foods
              <FiArrowRight />
            </Link>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">
              Quick Links
            </h3>

            <div className="mt-5 flex flex-col gap-3">
              <Link
                to="/"
                className="text-sm text-gray-600 transition-colors duration-200 hover:text-[#A88416]"
              >
                Home
              </Link>

              <Link
                to="/products"
                className="text-sm text-gray-600 transition-colors duration-200 hover:text-[#A88416]"
              >
                Products
              </Link>

              <Link
                to="/cart"
                className="text-sm text-gray-600 transition-colors duration-200 hover:text-[#A88416]"
              >
                Cart
              </Link>

              <Link
                to="/orders"
                className="text-sm text-gray-600 transition-colors duration-200 hover:text-[#A88416]"
              >
                My Orders
              </Link>

              <Link
                to="/addresses"
                className="text-sm text-gray-600 transition-colors duration-200 hover:text-[#A88416]"
              >
                My Addresses
              </Link>
            </div>
          </div>

          {/* Customer */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">
              Customer
            </h3>

            <div className="mt-5 flex flex-col gap-3">
              <Link
                to="/login"
                className="text-sm text-gray-600 transition-colors duration-200 hover:text-[#A88416]"
              >
                Login
              </Link>

              <Link
                to="/products"
                className="text-sm text-gray-600 transition-colors duration-200 hover:text-[#A88416]"
              >
                Shop Now
              </Link>

              <Link
                to="/cart"
                className="text-sm text-gray-600 transition-colors duration-200 hover:text-[#A88416]"
              >
                Shopping Cart
              </Link>

              <Link
                to="/orders"
                className="text-sm text-gray-600 transition-colors duration-200 hover:text-[#A88416]"
              >
                Track Orders
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">
              Contact Us
            </h3>

            <div className="mt-5 space-y-4">
              <div className="flex items-start gap-3">
                <FiMapPin className="mt-0.5 shrink-0 text-[#C9A227]" />

                <p className="text-sm leading-6 text-gray-600">
                  Andhra Pradesh,
                  <br />
                  India
                </p>
              </div>

              <a
                href="tel:+919999999999"
                className="flex items-center gap-3 text-sm text-gray-600 transition-colors duration-200 hover:text-[#A88416]"
              >
                <FiPhone className="text-[#C9A227]" />
                +91 99999 99999
              </a>

              <a
                href="mailto:support@godavarifoods.com"
                className="flex items-center gap-3 text-sm text-gray-600 transition-colors duration-200 hover:text-[#A88416]"
              >
                <FiMail className="text-[#C9A227]" />
                support@godavarifoods.com
              </a>
            </div>

            {/* Social */}
            <div className="mt-6 flex items-center gap-3">
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E8E3D5] text-gray-600 transition-all duration-200 hover:border-[#C9A227] hover:text-[#A88416]"
              >
                <FiFacebook />
              </a>

              <a
                href="#"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E8E3D5] text-gray-600 transition-all duration-200 hover:border-[#C9A227] hover:text-[#A88416]"
              >
                <FiInstagram />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-[#E8E3D5] pt-6">
          <div className="flex flex-col gap-3 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Godavari Foods. All rights reserved.
            </p>

            <p className="text-sm text-gray-500">
              Made with{" "}
              <span className="font-semibold text-[#A88416]">
                tradition
              </span>{" "}
              & care.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;