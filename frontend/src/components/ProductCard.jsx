import { Link } from "react-router-dom";

import {
  FiArrowRight,
  FiPackage,
} from "react-icons/fi";

const ProductCard = ({ product }) => {
  const primaryImage = product.images?.find(
    (image) => image.isPrimary
  );

  const imageUrl =
    primaryImage?.url ||
    product.images?.[0]?.url;

  return (
    <article className="group overflow-hidden rounded-2xl border border-[#E8E3D5] bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#C9A227] hover:shadow-lg">

      {/* Product Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#F7F2DF]">

        {imageUrl ? (
          <img
            src={imageUrl}
            alt={
              primaryImage?.altText ||
              product.name
            }
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <FiPackage className="text-5xl text-[#C9A227]" />
          </div>
        )}

        {/* Category Badge */}
        {product.category?.name && (
          <span className="absolute left-4 top-4 rounded-full border border-[#E8E3D5] bg-white/95 px-3 py-1 text-xs font-semibold text-[#A88416] shadow-sm">
            {product.category.name}
          </span>
        )}

      </div>

      {/* Product Content */}
      <div className="p-5">

        <h2 className="line-clamp-1 text-lg font-bold text-gray-900">
          {product.name}
        </h2>

        <p className="mt-2 line-clamp-2 min-h-[48px] text-sm leading-6 text-gray-600">
          {product.description ||
            "Traditional homemade food from the Godavari region."}
        </p>

        {/* Price */}
        <div className="mt-5 flex items-center justify-between">

          <div>
            <p className="text-xs text-gray-500">
              Starting from
            </p>

            <p className="mt-1 text-xl font-bold text-[#A88416]">
              ₹{product.price}
            </p>
          </div>

          {product.variants?.length > 0 && (
            <span className="text-xs text-gray-500">
              {product.variants.length}{" "}
              {product.variants.length === 1
                ? "variant"
                : "variants"}
            </span>
          )}

        </div>

        {/* Button */}
        <Link
          to={`/products/${product.id}`}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-[#C9A227] px-4 py-3 text-sm font-semibold text-[#A88416] transition-all duration-200 hover:bg-[#C9A227] hover:text-white"
        >
          View Product
          <FiArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
        </Link>

      </div>
    </article>
  );
};

export default ProductCard;