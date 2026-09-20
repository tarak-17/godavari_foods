import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { loginUser } from "../services/authService";

import {
  FiMail,
  FiLock,
  FiLogIn,
  FiLoader,
} from "react-icons/fi";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Page loading
  const [pageLoading, setPageLoading] = useState(true);

  // Login request loading
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Page initialization
  useEffect(() => {
    const initializePage = async () => {
      // Small delay so the loading state is visible
      await new Promise((resolve) =>
        setTimeout(resolve, 500)
      );

      setPageLoading(false);
    };

    initializePage();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const data = await loginUser(email, password);

      // Save JWT token
      localStorage.setItem("token", data.token);

      setSuccess("Login successful!");

      console.log("Login response:", data);

      // Navigate after successful login
      setTimeout(() => {
        navigate("/");
      }, 500);
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ================= PAGE LOADING =================

  if (pageLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF9F5]">
        <div className="flex flex-col items-center">

          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#C9A227] bg-white shadow-sm">
            <FiLoader className="animate-spin text-2xl text-[#C9A227]" />
          </div>

          <p className="mt-4 text-sm font-medium text-gray-600">
            Loading...
          </p>

        </div>
      </div>
    );
  }

  // ================= LOGIN PAGE =================

  return (
    <div className="min-h-screen bg-[#FAF9F5]">

      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-10 sm:px-6">

        <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-[#E8E3D5] bg-white shadow-xl lg:grid-cols-2">

          {/* ================= LEFT SIDE ================= */}

          <div className="hidden bg-[#F7F2DF] p-12 lg:flex lg:flex-col lg:justify-between">

            <div>
              <Link
                to="/"
                className="inline-flex items-center gap-3"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#C9A227] bg-white">
                  <span className="font-bold text-[#C9A227]">
                    G
                  </span>
                </div>

                <div>
                  <p className="font-bold tracking-wide text-gray-900">
                    GODAVARI
                  </p>

                  <p className="text-[10px] font-medium tracking-[0.25em] text-[#A88416]">
                    FOODS
                  </p>
                </div>
              </Link>

              <div className="mt-20">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#A88416]">
                  Welcome Back
                </p>

                <h1 className="mt-4 text-4xl font-bold leading-tight text-gray-950">
                  Taste the tradition of Godavari.
                </h1>

                <p className="mt-5 max-w-md leading-7 text-gray-600">
                  Sign in to continue shopping your favorite
                  traditional foods and manage your orders.
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-500">
              Authentic taste. Traditional recipes.
            </p>
          </div>

          {/* ================= LOGIN FORM ================= */}

          <div className="p-6 sm:p-10 lg:p-12">

            <div className="mx-auto max-w-md">

              {/* Mobile Logo */}
              <div className="mb-10 lg:hidden">
                <Link
                  to="/"
                  className="inline-flex items-center gap-3"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#C9A227]">
                    <span className="font-bold text-[#C9A227]">
                      G
                    </span>
                  </div>

                  <div>
                    <p className="font-bold tracking-wide text-gray-900">
                      GODAVARI
                    </p>

                    <p className="text-[9px] font-medium tracking-[0.25em] text-[#A88416]">
                      FOODS
                    </p>
                  </div>
                </Link>
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#A88416]">
                  Account
                </p>

                <h2 className="mt-2 text-3xl font-bold text-gray-950">
                  Welcome back
                </h2>

                <p className="mt-2 text-sm text-gray-600">
                  Login to your Godavari Foods account.
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* Success */}
              {success && (
                <div className="mt-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  {success}
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-5"
              >

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-gray-800"
                  >
                    Email
                  </label>

                  <div className="relative">

                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      placeholder="Enter your email"
                      required
                      disabled={loading}
                      className="w-full rounded-lg border border-[#DDD8C9] bg-white py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/10 disabled:cursor-not-allowed disabled:bg-gray-50"
                    />

                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-gray-800"
                  >
                    Password
                  </label>

                  <div className="relative">

                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      placeholder="Enter your password"
                      required
                      disabled={loading}
                      className="w-full rounded-lg border border-[#DDD8C9] bg-white py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/10 disabled:cursor-not-allowed disabled:bg-gray-50"
                    />

                  </div>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#C9A227] px-5 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#A88416] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <FiLoader className="animate-spin text-lg" />
                      Logging in...
                    </>
                  ) : (
                    <>
                      <FiLogIn className="text-lg" />
                      Login
                    </>
                  )}
                </button>

              </form>

              {/* Back Home */}
              <div className="mt-8 text-center">
                <Link
                  to="/"
                  className="text-sm font-medium text-gray-500 transition-colors duration-200 hover:text-[#A88416]"
                >
                  ← Back to home
                </Link>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;