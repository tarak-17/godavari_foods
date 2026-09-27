import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff, FiLock, FiMail } from "react-icons/fi";

const API_URL = "http://localhost:5050/api";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Login failed."
        );
      }

      /*
       * Your existing backend should return a token.
       * We save it so the admin pages can use it.
       */
      const token =
        data.token ||
        data.accessToken;

      if (!token) {
        throw new Error(
          "Login succeeded but no token was returned."
        );
      }

      /*
       * Check the logged-in user's role.
       */
      const user =
        data.user ||
        data.data?.user;

      if (
        user &&
        String(user.role).toUpperCase() !== "ADMIN"
      ) {
        localStorage.removeItem("token");

        throw new Error(
          "You do not have admin access."
        );
      }

      localStorage.setItem(
        "token",
        token
      );

      if (user) {
        localStorage.setItem(
          "user",
          JSON.stringify(user)
        );
      }

      navigate("/admin");

    } catch (error) {
      console.error(
        "Admin login error:",
        error
      );

      setError(
        error.message ||
        "Unable to login."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] px-4 py-10">

      <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-md items-center justify-center">

        <div className="w-full rounded-2xl border border-[#E8E3D5] bg-white p-6 shadow-xl sm:p-8">

          {/* LOGO */}

          <div className="text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#C9A227] bg-[#F7F2DF]">

              <span className="text-2xl font-bold text-[#A88416]">
                G
              </span>

            </div>

            <h1 className="mt-5 text-2xl font-bold text-gray-950">
              Godavari Foods
            </h1>

            <p className="mt-1 text-sm text-[#A88416]">
              Admin Panel
            </p>

          </div>

          {/* TITLE */}

          <div className="mt-8">

            <h2 className="text-xl font-bold text-gray-900">
              Admin Login
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Sign in to manage your store.
            </p>

          </div>

          {/* ERROR */}

          {error && (
            <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-5"
          >

            {/* EMAIL */}

            <div>

              <label
                htmlFor="admin-email"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Email
              </label>

              <div className="relative">

                <FiMail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />

                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="admin@example.com"
                  autoComplete="email"
                  className="w-full rounded-lg border border-[#E8E3D5] bg-white py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20"
                />

              </div>

            </div>

            {/* PASSWORD */}

            <div>

              <label
                htmlFor="admin-password"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Password
              </label>

              <div className="relative">

                <FiLock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />

                <input
                  id="admin-password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full rounded-lg border border-[#E8E3D5] bg-white py-3 pl-10 pr-12 text-sm text-gray-900 outline-none transition focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-[#A88416]"
                >
                  {showPassword ? (
                    <FiEyeOff size={18} />
                  ) : (
                    <FiEye size={18} />
                  )}
                </button>

              </div>

            </div>

            {/* LOGIN BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-lg bg-[#C9A227] px-5 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#A88416] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Signing in..."
                : "Admin Login"}
            </button>

          </form>

          {/* FOOTER */}

          <div className="mt-8 border-t border-[#E8E3D5] pt-5 text-center">

            <p className="text-xs text-gray-400">
              Godavari Foods Admin Panel
            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default AdminLogin;