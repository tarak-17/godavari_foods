import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  FiArrowLeft,
  FiCheck,
  FiChevronLeft,
  FiChevronRight,
  FiHeart,
  FiLoader,
  FiPackage,
  FiShoppingCart,
  FiTruck,
} from "react-icons/fi";

import Navbar from "../components/Navbar";

import { addToCart } from "../services/cartService";

const ProductDetails = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [message, setMessage] = useState("");

  const [selectedVariant, setSelectedVariant] =
    useState(null);

  const [selectedImage, setSelectedImage] =
    useState(0);

  const [addingToCart, setAddingToCart] =
    useState(false);

  const token = localStorage.getItem("token");

  // ================= FETCH PRODUCT =================

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:5050/api/products/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch product"
          );
        }

        setProduct(data.product);

        // Select first available variant
        if (data.product.variants?.length > 0) {
          const firstAvailableVariant =
            data.product.variants.find(
              (variant) => variant.stock > 0
            );

          setSelectedVariant(
            firstAvailableVariant ||
              data.product.variants[0]
          );
        }
      } catch (error) {
        console.error(
          "Fetch product error:",
          error
        );

        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // ================= ADD TO CART =================

  const handleAddToCart = async () => {
    if (!token) {
      setError(
        "Please login before adding products to cart."
      );
      return;
    }

    if (!selectedVariant) {
      setError("Please select a variant.");
      return;
    }

    if (selectedVariant.stock <= 0) {
      setError("This variant is out of stock.");
      return;
    }

    try {
      setAddingToCart(true);

      setError("");
      setMessage("");

      await addToCart(
        product.id,
        selectedVariant.id,
        1,
        token
      );

      setMessage(
        "Product added to cart successfully!"
      );
    } catch (error) {
      console.error(
        "Add to cart error:",
        error
      );

      setError(error.message);
    } finally {
      setAddingToCart(false);
    }
  };

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
                Loading product...
              </p>

            </div>

          </div>
        </main>
      </>
    );
  }

  // ================= ERROR =================

  if (error && !product) {
    return (
      <>
        <Navbar />

        <main className="min-h-screen bg-[#FAF9F5] px-4 py-16 sm:px-6">

          <div className="mx-auto flex min-h-[60vh] max-w-xl items-center justify-center">

            <div className="w-full rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
                <FiPackage className="text-2xl" />
              </div>

              <h1 className="mt-5 text-xl font-bold text-gray-900">
                Unable to load product
              </h1>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                {error}
              </p>

              <Link
                to="/products"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#C9A227] px-5 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#A88416]"
              >
                <FiArrowLeft />
                Back to Products
              </Link>

            </div>

          </div>

        </main>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />

        <main className="flex min-h-screen items-center justify-center bg-[#FAF9F5]">
          <p className="text-gray-600">
            Product not found.
          </p>
        </main>
      </>
    );
  }

  const images = product.images || [];

  const currentImage = images[selectedImage];

  // ================= PAGE =================

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#FAF9F5]">

        {/* Breadcrumb */}
        <div className="border-b border-[#E8E3D5] bg-white">

          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">

            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors duration-200 hover:text-[#A88416]"
            >
              <FiArrowLeft />
              Back to Products
            </Link>

          </div>

        </div>

        {/* Product Section */}
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">

          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">

            {/* ================= IMAGES ================= */}

            <div>

              {/* Main Image */}
              <div className="relative aspect-square overflow-hidden rounded-3xl border border-[#E8E3D5] bg-white shadow-sm">

                {currentImage?.url ? (
                  <img
                    src={currentImage.url}
                    alt={
                      currentImage.altText ||
                      product.name
                    }
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-[#F7F2DF]">
                    <FiPackage className="text-7xl text-[#C9A227]" />
                  </div>
                )}

                {/* Wishlist */}
                <button
                  type="button"
                  aria-label="Add to wishlist"
                  className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-[#E8E3D5] bg-white text-gray-600 shadow-sm transition-all duration-200 hover:border-[#C9A227] hover:text-[#C9A227]"
                >
                  <FiHeart className="text-lg" />
                </button>

              </div>

              {/* Thumbnail Images */}
              {images.length > 1 && (
                <div className="mt-4 flex gap-3 overflow-x-auto">

                  {images.map((image, index) => (
                    <button
                      key={image.id}
                      type="button"
                      onClick={() =>
                        setSelectedImage(index)
                      }
                      className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 bg-white transition-all duration-200 ${
                        selectedImage === index
                          ? "border-[#C9A227]"
                          : "border-[#E8E3D5] hover:border-[#C9A227]"
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={
                          image.altText ||
                          `${product.name} ${index + 1}`
                        }
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}

                </div>
              )}

              {/* Image Navigation */}
              {images.length > 1 && (
                <div className="mt-4 flex justify-end gap-2">

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedImage(
                        selectedImage === 0
                          ? images.length - 1
                          : selectedImage - 1
                      )
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E8E3D5] bg-white text-gray-600 transition-colors duration-200 hover:border-[#C9A227] hover:text-[#A88416]"
                  >
                    <FiChevronLeft />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedImage(
                        selectedImage ===
                          images.length - 1
                          ? 0
                          : selectedImage + 1
                      )
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E8E3D5] bg-white text-gray-600 transition-colors duration-200 hover:border-[#C9A227] hover:text-[#A88416]"
                  >
                    <FiChevronRight />
                  </button>

                </div>
              )}

            </div>

            {/* ================= PRODUCT INFO ================= */}

            <div className="flex flex-col justify-center">

              {/* Category */}
              {product.category?.name && (
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#A88416]">
                  {product.category.name}
                </p>
              )}

              {/* Product Name */}
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
                {product.name}
              </h1>

              {/* Description */}
              <p className="mt-5 text-base leading-7 text-gray-600">
                {product.description}
              </p>

              {/* Price */}
              <div className="mt-7">

                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Starting from
                </p>

                <p className="mt-1 text-3xl font-bold text-[#A88416]">
                  ₹
                  {selectedVariant
                    ? selectedVariant.price
                    : product.price}
                </p>

              </div>

              {/* Divider */}
              <div className="my-7 h-px bg-[#E8E3D5]" />

              {/* Variants */}
              <div>

                <div className="flex items-center justify-between">

                  <h2 className="text-lg font-bold text-gray-900">
                    Choose Quantity
                  </h2>

                  {selectedVariant && (
                    <span className="text-sm text-gray-500">
                      Selected:{" "}
                      <span className="font-semibold text-gray-800">
                        {selectedVariant.quantity}
                      </span>
                    </span>
                  )}

                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">

                  {product.variants?.map(
                    (variant) => {
                      const isSelected =
                        selectedVariant?.id ===
                        variant.id;

                      const isOutOfStock =
                        variant.stock <= 0;

                      return (
                        <button
                          key={variant.id}
                          type="button"
                          disabled={isOutOfStock}
                          onClick={() =>
                            setSelectedVariant(
                              variant
                            )
                          }
                          className={`rounded-xl border px-4 py-4 text-left transition-all duration-200 ${
                            isSelected
                              ? "border-[#C9A227] bg-[#F7F2DF] shadow-sm"
                              : isOutOfStock
                              ? "cursor-not-allowed border-gray-200 bg-gray-50 opacity-50"
                              : "border-[#E8E3D5] bg-white hover:border-[#C9A227]"
                          }`}
                        >

                          <p className="font-semibold text-gray-900">
                            {variant.quantity}
                          </p>

                          <p className="mt-1 text-sm font-bold text-[#A88416]">
                            ₹{variant.price}
                          </p>

                          <p className="mt-2 text-xs text-gray-500">
                            {isOutOfStock
                              ? "Out of stock"
                              : `${variant.stock} available`}
                          </p>

                        </button>
                      );
                    }
                  )}

                </div>

              </div>

              {/* Messages */}
              {message && (
                <div className="mt-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">

                  <FiCheck className="flex-shrink-0" />

                  {message}

                </div>
              )}

              {error && (
                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* Add Cart */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={
                  addingToCart ||
                  !selectedVariant ||
                  selectedVariant.stock <= 0
                }
                className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl bg-[#C9A227] px-6 py-4 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#A88416] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              >

                {addingToCart ? (
                  <>
                    <FiLoader className="animate-spin text-lg" />
                    Adding to Cart...
                  </>
                ) : selectedVariant?.stock <= 0 ? (
                  <>
                    <FiPackage className="text-lg" />
                    Out of Stock
                  </>
                ) : (
                  <>
                    <FiShoppingCart className="text-lg" />
                    Add to Cart
                  </>
                )}

              </button>

              {/* Product Benefits */}
              <div className="mt-7 grid gap-3 border-t border-[#E8E3D5] pt-6 sm:grid-cols-3">

                <div className="flex items-center gap-3">

                  <FiCheck className="text-lg text-[#C9A227]" />

                  <span className="text-xs font-medium text-gray-600">
                    Authentic Quality
                  </span>

                </div>

                <div className="flex items-center gap-3">

                  <FiTruck className="text-lg text-[#C9A227]" />

                  <span className="text-xs font-medium text-gray-600">
                    Fresh Delivery
                  </span>

                </div>

                <div className="flex items-center gap-3">

                  <FiPackage className="text-lg text-[#C9A227]" />

                  <span className="text-xs font-medium text-gray-600">
                    Secure Packaging
                  </span>

                </div>

              </div>

            </div>
          </div>
        </section>

      </main>
    </>
  );
};

export default ProductDetails;