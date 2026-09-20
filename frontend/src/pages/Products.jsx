import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";

import { getProducts } from "../services/productService";

import {
  FiAlertCircle,
  FiLoader,
  FiSearch,
} from "react-icons/fi";

const Products = () => {
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProducts();

        setProducts(data.products);
      } catch (error) {
        console.error(
          "Fetch products error:",
          error
        );

        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ================= LOADING =================

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="min-h-screen bg-[#FAF9F5]">
          <div className="flex min-h-[70vh] items-center justify-center">

            <div className="flex flex-col items-center">

              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#C9A227] bg-white shadow-sm">
                <FiLoader className="animate-spin text-2xl text-[#C9A227]" />
              </div>

              <p className="mt-4 text-sm font-medium text-gray-600">
                Loading products...
              </p>

            </div>

          </div>
        </main>
      </>
    );
  }

  // ================= ERROR =================

  if (error) {
    return (
      <>
        <Navbar />

        <main className="min-h-screen bg-[#FAF9F5] px-4 py-16 sm:px-6">

          <div className="mx-auto flex min-h-[60vh] max-w-xl items-center justify-center">

            <div className="w-full rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
                <FiAlertCircle className="text-2xl" />
              </div>

              <h1 className="mt-5 text-xl font-bold text-gray-900">
                Unable to load products
              </h1>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                {error}
              </p>

              <button
                onClick={() => window.location.reload()}
                className="mt-6 rounded-lg bg-[#C9A227] px-5 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#A88416]"
              >
                Try Again
              </button>

            </div>

          </div>

        </main>
      </>
    );
  }

  // ================= PAGE =================

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#FAF9F5]">

        {/* Header */}
        <section className="border-b border-[#E8E3D5] bg-white">

          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">

            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

              <div>

                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#A88416]">
                  Our Collection
                </p>

                <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
                  Traditional Foods
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
                  Discover authentic homemade foods inspired
                  by the flavors and traditions of the Godavari
                  region.
                </p>

              </div>

              {/* Product Count */}
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="font-semibold text-gray-900">
                  {products.length}
                </span>
                products available
              </div>

            </div>

          </div>

        </section>

        {/* Products */}
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">

          {/* Search UI - visual for now */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="relative w-full max-w-md">

              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                placeholder="Search products..."
                className="w-full rounded-lg border border-[#DDD8C9] bg-white py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/10"
              />

            </div>

          </div>

          {/* Empty State */}
          {products.length === 0 ? (
            <div className="rounded-2xl border border-[#E8E3D5] bg-white p-10 text-center shadow-sm">

              <FiPackage className="mx-auto text-4xl text-[#C9A227]" />

              <h2 className="mt-4 text-xl font-bold text-gray-900">
                No products found
              </h2>

              <p className="mt-2 text-sm text-gray-600">
                We don't have any products available right now.
              </p>

            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}

            </div>
          )}

        </section>

      </main>
    </>
  );
};

export default Products;