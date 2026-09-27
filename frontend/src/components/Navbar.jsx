import { useEffect, useState } from "react";

import {
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  FiShoppingCart,
  FiPackage,
  FiHome,
  FiGrid,
  FiUser,
  FiMapPin,
  FiLogOut,
  FiX,
} from "react-icons/fi";

import { getCart } from "../services/cartService";

const Navbar = () => {
  const navigate = useNavigate();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  // Temporary user
  const userName = "T";

  // -----------------------------------------
  // CART COUNT
  // -----------------------------------------

  const fetchCartCount = async () => {
    const currentToken = localStorage.getItem("token");

    if (!currentToken) {
      setCartCount(0);
      return;
    }

    try {
      const data = await getCart(currentToken);

      const items = data.cart?.items || [];

      const totalItems = items.reduce(
        (total, item) =>
          total + Number(item.quantity || 0),
        0
      );

      setCartCount(totalItems);
    } catch (error) {
      console.error(
        "Failed to fetch cart count:",
        error
      );

      setCartCount(0);
    }
  };

  // -----------------------------------------
  // INITIAL LOAD
  // -----------------------------------------

  useEffect(() => {
    if (token) {
      fetchCartCount();
    } else {
      setCartCount(0);
    }
  }, [token]);

  // -----------------------------------------
  // AUTH CHANGE
  // -----------------------------------------

  useEffect(() => {
    const handleAuthChanged = () => {
      const currentToken =
        localStorage.getItem("token");

      setToken(currentToken);

      if (currentToken) {
        fetchCartCount();
      } else {
        setCartCount(0);
      }
    };

    window.addEventListener(
      "authChanged",
      handleAuthChanged
    );

    return () => {
      window.removeEventListener(
        "authChanged",
        handleAuthChanged
      );
    };
  }, []);

  // -----------------------------------------
  // CART CHANGE
  // -----------------------------------------

  useEffect(() => {
    const handleCartChanged = (event) => {
      const count = event.detail?.count;

      if (typeof count === "number") {
        setCartCount(count);
      } else {
        fetchCartCount();
      }
    };

    window.addEventListener(
      "cartChanged",
      handleCartChanged
    );

    return () => {
      window.removeEventListener(
        "cartChanged",
        handleCartChanged
      );
    };
  }, []);

  // -----------------------------------------
  // LOGOUT
  // -----------------------------------------

  const handleLogout = () => {
    localStorage.removeItem("token");

    setToken(null);
    setCartCount(0);
    setIsProfileOpen(false);

    window.dispatchEvent(
      new Event("authChanged")
    );

    navigate("/login");
  };

  // -----------------------------------------
  // DESKTOP NAV
  // -----------------------------------------

  const desktopNavClass = ({ isActive }) =>
    `flex items-center gap-2 text-sm font-medium transition-colors duration-200 ${
      isActive
        ? "text-[#C9A227]"
        : "text-gray-700 hover:text-[#C9A227]"
    }`;

  // -----------------------------------------
  // MOBILE NAV
  // -----------------------------------------

  const mobileNavClass = ({ isActive }) =>
    `flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-all duration-200 ${
      isActive
        ? "text-[#C9A227]"
        : "text-gray-500"
    }`;

  return (
    <>
      {/* =================================================
          DESKTOP TOP NAVBAR
      ================================================= */}

      <nav className="sticky top-0 z-50 hidden border-b border-[#E8E3D5] bg-white/95 backdrop-blur-md md:block">

        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* LOGO */}

          <Link
            to="/"
            className="flex items-center gap-2"
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

          {/* DESKTOP LINKS */}

          <div className="flex items-center gap-8">

            <NavLink
              to="/"
              className={desktopNavClass}
            >
              <FiHome />
              Home
            </NavLink>

            <NavLink
              to="/products"
              className={desktopNavClass}
            >
              <FiGrid />
              Products
            </NavLink>

            <NavLink
              to="/orders"
              className={desktopNavClass}
            >
              <FiPackage />
              Orders
            </NavLink>

          </div>

          {/* RIGHT */}

          <div className="flex items-center gap-3">

            {/* CART */}

            <Link
              to="/cart"
              className=" relative flex h-10 w-10 items-center justify-center rounded-full border border-[#E8E3D5] text-gray-700 transition hover:border-[#C9A227] hover:text-[#C9A227]"
            >
              <FiShoppingCart />

              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#C9A227] px-1 text-[10px] font-bold text-white">
                  {cartCount > 99
                    ? "99+"
                    : cartCount}
                </span>
              )}
            </Link>

            {/* PROFILE */}

            {token ? (
              <button
                type="button"
                onClick={() =>
                  setIsProfileOpen(true)
                }
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#C9A227] bg-[#F7F2DF] text-sm font-bold text-[#A88416] transition hover:bg-[#C9A227] hover:text-white"
              >
                {userName.charAt(0)}
              </button>
            ) : (
              <Link
                to="/login"
                className="rounded-xl border border-[#C9A227] px-5 py-2.5 text-sm font-semibold text-[#A88416] transition hover:bg-[#C9A227] hover:text-white"
              >
                Login
              </Link>
            )}

          </div>
        </div>
      </nav>

      {/* =================================================
          MOBILE TOP BAR
      ================================================= */}

      <div className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-[#E8E3D5] bg-white px-4 shadow-sm md:hidden">

        {/* LOGO */}

        <Link
          to="/"
          className="flex items-center gap-2"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#C9A227]">
            <span className="text-base font-bold text-[#C9A227]">
              G
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-wide text-black">
              GODAVARI
            </span>

            <span className="text-[8px] font-medium tracking-[0.2em] text-[#C9A227]">
              FOODS
            </span>
          </div>
        </Link>

        {/* TOP RIGHT */}

        <div className="flex items-center gap-3">

          {/* CART */}

          {/* <Link
            to="/cart"
            className="relative flex h-9 w-9 items-center justify-center text-gray-700"
          >
            <FiShoppingCart className="text-xl" />

            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#C9A227] px-1 text-[8px] font-bold text-white">
                {cartCount > 9
                  ? "9+"
                  : cartCount}
              </span>
            )}
          </Link> */}

          {/* PROFILE */}

          {token ? (
            <button
              type="button"
              onClick={() =>
                setIsProfileOpen(true)
              }
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#C9A227] bg-[#F7F2DF] text-xs font-bold text-[#A88416]"
            >
              {userName.charAt(0)}
            </button>
          ) : (
            <Link
              to="/login"
              className="text-sm font-semibold text-[#A88416]"
            >
              Login
            </Link>
          )}

        </div>
      </div>

      {/* =================================================
          MOBILE BOTTOM NAVIGATION
      ================================================= */}

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#E8E3D5] bg-white/95 backdrop-blur-md md:hidden">

        <div className="mx-auto grid h-16 max-w-md grid-cols-5">

          {/* HOME */}

          <NavLink
            to="/"
            className={mobileNavClass}
          >
            {({ isActive }) => (
              <>
                <FiHome
                  className={`text-xl ${
                    isActive
                      ? "stroke-[2.5]"
                      : "stroke-[1.5]"
                  }`}
                />

                <span>Home</span>
              </>
            )}
          </NavLink>

          {/* PRODUCTS */}

          <NavLink
            to="/products"
            className={mobileNavClass}
          >
            {({ isActive }) => (
              <>
                <FiGrid
                  className={`text-xl ${
                    isActive
                      ? "stroke-[2.5]"
                      : "stroke-[1.5]"
                  }`}
                />

                <span>Shop</span>
              </>
            )}
          </NavLink>

          {/* ORDERS */}

          <NavLink
            to="/orders"
            className={mobileNavClass}
          >
            {({ isActive }) => (
              <>
                <FiPackage
                  className={`text-xl ${
                    isActive
                      ? "stroke-[2.5]"
                      : "stroke-[1.5]"
                  }`}
                />

                <span>Orders</span>
              </>
            )}
          </NavLink>

          {/* CART */}

          <NavLink
            to="/cart"
            className={mobileNavClass}
          >
            {({ isActive }) => (
              <div className="relative flex flex-col items-center">

                <FiShoppingCart
                  className={`text-xl ${
                    isActive
                      ? "stroke-[2.5]"
                      : "stroke-[1.5]"
                  }`}
                />

                {cartCount > 0 && (
                  <span className="absolute -right-3 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#C9A227] px-1 text-[8px] font-bold text-white">
                    {cartCount > 9
                      ? "9+"
                      : cartCount}
                  </span>
                )}

                <span>Cart</span>

              </div>
            )}
          </NavLink>

          {/* PROFILE */}

          <button
            type="button"
            onClick={() => {
              if (token) {
                setIsProfileOpen(true);
              } else {
                navigate("/login");
              }
            }}
            className="flex flex-col items-center justify-center gap-1 text-[10px] font-medium text-gray-500 transition hover:text-[#C9A227]"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-400 text-[10px]">
              {token ? (
                userName.charAt(0)
              ) : (
                <FiUser className="text-sm" />
              )}
            </div>

            <span>Profile</span>
          </button>

        </div>
      </div>

      {/* =================================================
          PROFILE SIDEBAR
      ================================================= */}

      {token && isProfileOpen && (
        <>
          {/* OVERLAY */}

          <div
            className="fixed inset-0 z-[60] bg-black/30"
            onClick={() =>
              setIsProfileOpen(false)
            }
          />

          {/* SIDEBAR */}

          <aside className="fixed right-0 top-0 z-[70] flex h-full w-[320px] max-w-[90vw] flex-col bg-white shadow-2xl">

            {/* HEADER */}

            <div className="flex items-center justify-between border-b border-[#E8E3D5] px-6 py-5">

              <div>
                <p className="text-xs font-semibold tracking-[0.25em] text-[#C9A227]">
                  ACCOUNT
                </p>

                <h2 className="mt-1 text-xl font-bold text-black">
                  My Account
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setIsProfileOpen(false)
                }
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E8E3D5] text-gray-600 hover:border-[#C9A227] hover:text-[#C9A227]"
              >
                <FiX />
              </button>

            </div>

            {/* USER */}

            <div className="border-b border-[#E8E3D5] px-6 py-6">

              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#C9A227] bg-[#F7F2DF] text-xl font-bold text-[#A88416]">
                  {userName.charAt(0)}
                </div>

                <div>
                  <p className="font-semibold text-black">
                    Welcome
                  </p>

                  <p className="text-sm text-gray-500">
                    Godavari Foods customer
                  </p>
                </div>

              </div>

            </div>

            {/* MENU */}

            <div className="flex-1 px-4 py-5">

              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  navigate("/profile");
                }}
                className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left text-sm font-medium text-gray-700 transition hover:bg-[#FAF8F0] hover:text-[#A88416]"
              >
                <FiUser className="text-lg" />
                My Profile
              </button>

              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  navigate("/addresses");
                }}
                className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left text-sm font-medium text-gray-700 transition hover:bg-[#FAF8F0] hover:text-[#A88416]"
              >
                <FiMapPin className="text-lg" />
                My Addresses
              </button>

              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  navigate("/orders");
                }}
                className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left text-sm font-medium text-gray-700 transition hover:bg-[#FAF8F0] hover:text-[#A88416]"
              >
                <FiPackage className="text-lg" />
                My Orders
              </button>

              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  navigate("/cart");
                }}
                className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left text-sm font-medium text-gray-700 transition hover:bg-[#FAF8F0] hover:text-[#A88416]"
              >
                <FiShoppingCart className="text-lg" />
                My Cart
              </button>

            </div>

            {/* LOGOUT */}

            <div className="border-t border-[#E8E3D5] p-5">

              <button
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#C9A227] px-4 py-3 text-sm font-semibold text-[#A88416] transition hover:bg-[#C9A227] hover:text-white"
              >
                <FiLogOut />
                Logout
              </button>

              <p className="mt-5 text-center text-xs text-gray-400">
                Godavari Foods
              </p>

            </div>

          </aside>
        </>
      )}
    </>
  );
};

export default Navbar;