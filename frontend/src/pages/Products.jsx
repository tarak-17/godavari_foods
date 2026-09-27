import { useEffect, useMemo, useState } from "react";

import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";

import { getProducts } from "../services/productService";
import { getCategories } from "../services/categoryService";

import {
  FiAlertCircle,
  FiLoader,
  FiSearch,
  FiPackage,
  FiX,
} from "react-icons/fi";

const Products = () => {
  // ==========================================
  // PRODUCTS
  // ==========================================

  const [products, setProducts] = useState([]);

  // ==========================================
  // CATEGORIES
  // ==========================================

  const [categories, setCategories] = useState([]);

  // ==========================================
  // LOADING
  // ==========================================

  const [loading, setLoading] = useState(true);

  // ==========================================
  // ERROR
  // ==========================================

  const [error, setError] = useState("");

  // ==========================================
  // SEARCH
  // ==========================================

  const [search, setSearch] = useState("");

  // ==========================================
  // SELECTED CATEGORY
  // null = all products
  // ==========================================

  const [selectedCategory, setSelectedCategory] =
    useState(null);

  // ==========================================
  // FETCH PRODUCTS + CATEGORIES
  // ==========================================

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [productData, categoryData] =
          await Promise.all([
            getProducts(),
            getCategories(),
          ]);

        setProducts(
          productData.products || []
        );

        setCategories(
          categoryData.categories || []
        );
      } catch (error) {
        console.error(
          "Products page error:",
          error
        );

        setError(
          error.message ||
            "Failed to load products"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ==========================================
  // FILTER PRODUCTS
  // ==========================================

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // ----------------------------------------
    // CATEGORY FILTER
    // ----------------------------------------

    if (selectedCategory !== null) {
      result = result.filter((product) => {
        return (
          Number(product.categoryId) ===
          Number(selectedCategory)
        );
      });
    }

    // ----------------------------------------
    // SEARCH FILTER
    // ----------------------------------------

    if (search.trim()) {
      const searchText =
        search.toLowerCase().trim();

      result = result.filter((product) => {
        const productName =
          product.name?.toLowerCase() || "";

        const description =
          product.description?.toLowerCase() || "";

        return (
          productName.includes(searchText) ||
          description.includes(searchText)
        );
      });
    }

    return result;
  }, [
    products,
    selectedCategory,
    search,
  ]);

  // ==========================================
  // SELECT CATEGORY
  // ==========================================

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);

    // Scroll slightly toward products
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // CLEAR FILTERS
  // ==========================================

  const clearFilters = () => {
    setSelectedCategory(null);
    setSearch("");
  };

  // ==========================================
  // CURRENT CATEGORY NAME
  // ==========================================

  const selectedCategoryName =
    categories.find(
      (category) =>
        Number(category.id) ===
        Number(selectedCategory)
    )?.name;

  // ==========================================
  // LOADING
  // ==========================================

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

  // ==========================================
  // ERROR
  // ==========================================

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
                type="button"
                onClick={() =>
                  window.location.reload()
                }
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

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#FAF9F5]">

        {/* =====================================
            HEADER
        ====================================== */}

        <section className="border-b border-[#E8E3D5] bg-white">

          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">

            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

              <div>

                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#A88416]">
                  Our Collection
                </p>

                <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
                  Traditional Foods
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
                  Discover authentic homemade foods
                  inspired by the flavors and traditions
                  of the Godavari region.
                </p>

              </div>

              {/* PRODUCT COUNT */}

              <div className="flex items-center gap-2 text-sm text-gray-500">

                <span className="font-semibold text-gray-900">
                  {filteredProducts.length}
                </span>

                products available

              </div>

            </div>

          </div>

        </section>

        {/* =====================================
            CATEGORY SECTION
        ====================================== */}

        <section className="border-b border-[#E8E3D5] bg-white">

          <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">

            <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">

              {/* ALL */}

              <button
                type="button"
                onClick={() =>
                  handleCategoryClick(null)
                }
                className={`shrink-0 rounded-full border px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                  selectedCategory === null
                    ? "border-[#C9A227] bg-[#C9A227] text-white shadow-sm"
                    : "border-[#E8E3D5] bg-white text-gray-700 hover:border-[#C9A227] hover:text-[#A88416]"
                }`}
              >
                All Products
              </button>

              {/* CATEGORIES */}

              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() =>
                    handleCategoryClick(
                      category.id
                    )
                  }
                  className={`shrink-0 rounded-full border px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                    Number(selectedCategory) ===
                    Number(category.id)
                      ? "border-[#C9A227] bg-[#C9A227] text-white shadow-sm"
                      : "border-[#E8E3D5] bg-white text-gray-700 hover:border-[#C9A227] hover:text-[#A88416]"
                  }`}
                >
                  {category.name}
                </button>
              ))}

            </div>

          </div>

        </section>

        {/* =====================================
            PRODUCTS SECTION
        ====================================== */}

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">

          {/* SEARCH */}

          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="relative w-full max-w-md">

              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search products..."
                className="w-full rounded-lg border border-[#DDD8C9] bg-white py-3 pl-11 pr-10 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/10"
              />

              {/* CLEAR SEARCH */}

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center text-gray-400 transition-colors hover:text-[#A88416]"
                >
                  <FiX />
                </button>
              )}

            </div>

            {/* ACTIVE FILTER */}

            {selectedCategory !== null && (
              <div className="flex items-center gap-2 text-sm text-gray-600">

                <span>
                  Category:
                </span>

                <span className="font-semibold text-[#A88416]">
                  {selectedCategoryName}
                </span>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="ml-2 text-xs font-semibold text-gray-500 underline hover:text-[#A88416]"
                >
                  Clear
                </button>

              </div>
            )}

          </div>

          {/* ===================================
              EMPTY STATE
          ==================================== */}

          {filteredProducts.length === 0 ? (

            <div className="rounded-2xl border border-[#E8E3D5] bg-white p-10 text-center shadow-sm">

              <FiPackage className="mx-auto text-4xl text-[#C9A227]" />

              <h2 className="mt-4 text-xl font-bold text-gray-900">
                No products found
              </h2>

              <p className="mt-2 text-sm text-gray-600">
                {selectedCategory !== null
                  ? `There are no products in ${selectedCategoryName} matching your search.`
                  : "We don't have any products matching your search."}
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 rounded-lg bg-[#C9A227] px-5 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#A88416]"
              >
                View All Products
              </button>

            </div>

          ) : (

            /* =================================
               PRODUCT GRID
            ================================== */

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

              {filteredProducts.map((product) => (
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