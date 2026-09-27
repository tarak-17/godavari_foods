import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

// ============================================
// CUSTOMER PAGES
// ============================================

import Home from "./pages/Home";
import Login from "./pages/Login";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrdersList from "./pages/OrdersList";
import Orders from "./pages/Orders";
import Addresses from "./pages/Addresses";
import Profile from "./pages/Profile";

// ============================================
// CUSTOMER LAYOUT
// ============================================

import CustomerLayout from "./components/CustomerLayout";

// ============================================
// ADMIN PAGES
// ============================================

import AdminLogin from "./admin/pages/AdminLogin";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminOrders from "./admin/pages/AdminOrders";
import AdminOrderDetails from "./admin/pages/AdminOrderDetails";
import AdminProducts from "./admin/pages/AdminProducts";
import AdminAddProduct from "./admin/pages/AdminAddProduct";
import AdminCategories from "./admin/pages/AdminCategories";

// ============================================
// ADMIN LAYOUT
// ============================================

import AdminLayout from "./admin/components/AdminLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ========================================
            CUSTOMER APPLICATION
        ======================================== */}

        <Route element={<CustomerLayout />}>

          {/* HOME */}
          <Route
            path="/"
            element={<Home />}
          />

          {/* LOGIN */}
          <Route
            path="/login"
            element={<Login />}
          />

          {/* PRODUCTS */}
          <Route
            path="/products"
            element={<Products />}
          />

          {/* PRODUCT DETAILS */}
          <Route
            path="/products/:id"
            element={<ProductDetails />}
          />

          {/* CART */}
          <Route
            path="/cart"
            element={<Cart />}
          />

          {/* CHECKOUT */}
          <Route
            path="/checkout"
            element={<Checkout />}
          />

          {/* PROFILE */}
          <Route
            path="/profile"
            element={<Profile />}
          />

          {/* ADDRESSES */}
          <Route
            path="/addresses"
            element={<Addresses />}
          />

          {/* ORDERS LIST */}
          <Route
            path="/orders"
            element={<OrdersList />}
          />

          {/* ORDER DETAILS */}
          <Route
            path="/orders/:id"
            element={<Orders />}
          />

        </Route>

        {/* ========================================
            ADMIN LOGIN
            PUBLIC ROUTE
        ======================================== */}

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        {/* ========================================
            ADMIN APPLICATION
            PROTECTED BY AdminLayout
        ======================================== */}

        <Route
          path="/admin"
          element={<AdminLayout />}
        >

          {/* ADMIN DASHBOARD */}

          <Route
            index
            element={<AdminDashboard />}
          />

          {/* ADMIN PRODUCTS */}

          <Route
            path="products"
            element={<AdminProducts />}
          />

          {/* ADD PRODUCT */}

          <Route
            path="products/new"
            element={<AdminAddProduct />}
          />

          {/* ADMIN ORDERS */}

          <Route
            path="orders"
            element={<AdminOrders />}
          />

          {/* ADMIN ORDER DETAILS */}

          <Route
            path="orders/:id"
            element={<AdminOrderDetails />}
          />
          <Route
          path="categories"
          element={<AdminCategories />}
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;