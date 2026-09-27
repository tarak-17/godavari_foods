
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiEdit,
  FiEye,
  FiPlus,
  FiTrash2,
  FiPackage,
} from "react-icons/fi";

const API_URL = "http://localhost:5050/api";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/products`);

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            "Failed to fetch products."
        );
      }

      const productData =
        data?.data?.products ||
        data?.data ||
        data?.products ||
        [];

      setProducts(
        Array.isArray(productData) ? productData : []
      );
    } catch (error) {
      console.error("Admin products error:", error);

      setError(
        error.message || "Failed to load products."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#171717]">
            Products
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your Godavari Foods products and variants.
          </p>
        </div>

        <Link
          to="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C9A227] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#A88416]"
        >
          <FiPlus size={18} />
          Add Product
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="rounded-2xl border border-[#E8E3D5] bg-white p-10 text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-[#E8E3D5] border-t-[#C9A227]" />

          <p className="text-sm text-gray-500">
            Loading products...
          </p>
        </div>
      ) : products.length === 0 ? (
        /* Empty */
        <div className="rounded-2xl border border-[#E8E3D5] bg-white p-10 text-center">
          <FiPackage
            size={42}
            className="mx-auto text-[#C9A227]"
          />

          <h2 className="mt-4 text-lg font-semibold text-[#171717]">
            No products found
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Add your first product to get started.
          </p>
        </div>
      ) : (
        /* Products table */
        <div className="overflow-hidden rounded-2xl border border-[#E8E3D5] bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="border-b border-[#E8E3D5] bg-[#FAF9F5]">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Product
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Category
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Variants
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Stock
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#E8E3D5]">
                {products.map((product) => {
                  const variants = Array.isArray(product.variants)
                    ? product.variants
                    : [];

                  const totalStock = variants.reduce(
                    (total, variant) =>
                      total + Number(variant.stock || 0),
                    0
                  );

                  const images = Array.isArray(product.images)
                    ? product.images
                    : [];

                  const primaryImage =
                    images.find(
                      (image) => image?.isPrimary
                    ) || images[0];

                  return (
                    <tr
                      key={product.id}
                      className="transition hover:bg-[#FAF9F5]"
                    >
                      {/* Product */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {primaryImage?.url ? (
                            <img
                              src={primaryImage.url}
                              alt={
                                primaryImage.altText ||
                                product.name ||
                                "Product"
                              }
                              className="h-12 w-12 rounded-xl border border-[#E8E3D5] object-cover"
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F7F2DF] text-[#C9A227]">
                              <FiPackage size={20} />
                            </div>
                          )}

                          <div>
                            <p className="font-semibold text-[#171717]">
                              {product.name}
                            </p>

                            <p className="text-xs text-gray-500">
                              #{product.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {product.category?.name ||
                            "Uncategorized"}
                        </span>
                      </td>

                      {/* Variants */}
                      <td className="px-6 py-4">
                        <span className="inline-flex rounded-full bg-[#F7F2DF] px-3 py-1 text-xs font-semibold text-[#A88416]">
                          {variants.length}{" "}
                          {variants.length === 1
                            ? "variant"
                            : "variants"}
                        </span>
                      </td>

                      {/* Stock */}
                      <td className="px-6 py-4">
                        <span
                          className={`text-sm font-semibold ${
                            totalStock === 0
                              ? "text-red-600"
                              : totalStock <= 10
                              ? "text-orange-600"
                              : "text-green-600"
                          }`}
                        >
                          {totalStock}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          {/* View */}
                          <Link
                            to={`/admin/products/${product.id}`}
                            title="View product"
                            className="rounded-lg border border-[#E8E3D5] p-2 text-gray-600 transition hover:border-[#C9A227] hover:text-[#C9A227]"
                          >
                            <FiEye size={16} />
                          </Link>

                          {/* Edit */}
                          <Link
                            to={`/admin/products/${product.id}/edit`}
                            title="Edit product"
                            className="rounded-lg border border-[#E8E3D5] p-2 text-gray-600 transition hover:border-[#C9A227] hover:text-[#C9A227]"
                          >
                            <FiEdit size={16} />
                          </Link>

                          {/* Delete */}
                          <button
                            type="button"
                            title="Delete product"
                            className="rounded-lg border border-red-100 p-2 text-red-500 transition hover:bg-red-50"
                            onClick={() =>
                              alert(
                                "Delete functionality will be added next."
                              )
                            }
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;

