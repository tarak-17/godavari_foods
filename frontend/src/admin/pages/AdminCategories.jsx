import { useEffect, useState } from "react";
import {
  FiEdit2,
  FiPlus,
  FiTrash2,
  FiX,
  FiFolder,
} from "react-icons/fi";

const API_URL = "http://localhost:5050/api";

const emptyForm = {
  name: "",
  slug: "",
};

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [form, setForm] = useState(emptyForm);

  // ==========================================
  // GET TOKEN
  // ==========================================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // ==========================================
  // FETCH CATEGORIES
  // ==========================================

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/categories`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load categories"
        );
      }

      setCategories(data.categories || []);
    } catch (error) {
      console.error(
        "Fetch categories error:",
        error
      );

      setError(
        error.message ||
          "Failed to load categories."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ==========================================
  // OPEN ADD MODAL
  // ==========================================

  const handleAddCategory = () => {
    setEditingCategory(null);
    setForm(emptyForm);
    setError("");
    setSuccess("");
    setIsModalOpen(true);
  };

  // ==========================================
  // OPEN EDIT MODAL
  // ==========================================

  const handleEditCategory = (category) => {
    setEditingCategory(category);

    setForm({
      name: category.name || "",
      slug: category.slug || "",
    });

    setError("");
    setSuccess("");
    setIsModalOpen(true);
  };

  // ==========================================
  // CLOSE MODAL
  // ==========================================

  const closeModal = () => {
    if (saving) return;

    setIsModalOpen(false);
    setEditingCategory(null);
    setForm(emptyForm);
    setError("");
  };

  // ==========================================
  // FORM CHANGE
  // ==========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // CREATE / UPDATE
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const name = form.name.trim();
    const slug = form.slug.trim();

    // Frontend validation
    if (name.length < 2) {
      setError(
        "Category name must be at least 2 characters."
      );
      return;
    }

    if (name.length > 50) {
      setError(
        "Category name must not exceed 50 characters."
      );
      return;
    }

    if (slug.length < 2) {
      setError(
        "Slug must be at least 2 characters."
      );
      return;
    }

    if (slug.length > 60) {
      setError(
        "Slug must not exceed 60 characters."
      );
      return;
    }

    if (
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
    ) {
      setError(
        "Slug can contain only lowercase letters, numbers, and hyphens."
      );
      return;
    }

    const token = getToken();

    if (!token) {
      setError(
        "Admin authentication is required."
      );
      return;
    }

    try {
      setSaving(true);

      const isEditing = Boolean(editingCategory);

      const url = isEditing
        ? `${API_URL}/categories/${editingCategory.id}`
        : `${API_URL}/categories`;

      const response = await fetch(url, {
        method: isEditing ? "PATCH" : "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          name,
          slug,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to save category."
        );
      }

      setSuccess(
        isEditing
          ? "Category updated successfully."
          : "Category created successfully."
      );

      setIsModalOpen(false);
      setEditingCategory(null);
      setForm(emptyForm);

      await fetchCategories();
    } catch (error) {
      console.error(
        "Save category error:",
        error
      );

      setError(
        error.message ||
          "Failed to save category."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // DELETE CATEGORY
  // ==========================================

  const handleDeleteCategory = async (category) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${category.name}"?`
    );

    if (!confirmed) return;

    const token = getToken();

    if (!token) {
      setError(
        "Admin authentication is required."
      );
      return;
    }

    try {
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/categories/${category.id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete category."
        );
      }

      setSuccess(
        "Category deleted successfully."
      );

      await fetchCategories();
    } catch (error) {
      console.error(
        "Delete category error:",
        error
      );

      setError(
        error.message ||
          "Failed to delete category."
      );
    }
  };

  // ==========================================
  // GENERATE SLUG
  // ==========================================

  const generateSlug = () => {
    const slug = form.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    setForm((previous) => ({
      ...previous,
      slug,
    }));
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="space-y-6">

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#C9A227]">
            Management
          </p>

          <h1 className="mt-1 text-2xl font-bold text-[#171717] sm:text-3xl">
            Categories
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your product categories.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddCategory}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#C9A227] px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-[#A88416] hover:shadow-md"
        >
          <FiPlus size={18} />
          Add Category
        </button>

      </div>

      {/* =====================================
          SUCCESS MESSAGE
      ===================================== */}

      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      {/* =====================================
          ERROR MESSAGE
      ===================================== */}

      {error && !isModalOpen && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* =====================================
          CATEGORY COUNT
      ===================================== */}

      <div className="rounded-xl border border-[#E8E3D5] bg-white p-5 shadow-sm">

        <div className="mb-5 flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F7F2DF] text-[#C9A227]">
            <FiFolder size={20} />
          </div>

          <div>
            <h2 className="font-semibold text-[#171717]">
              All Categories
            </h2>

            <p className="text-sm text-gray-500">
              {categories.length}{" "}
              {categories.length === 1
                ? "category"
                : "categories"}
            </p>
          </div>

        </div>

        {/* =====================================
            LOADING
        ===================================== */}

        {loading ? (
          <div className="py-12 text-center text-sm text-gray-500">
            Loading categories...
          </div>
        ) : categories.length === 0 ? (
          /* ===================================
             EMPTY
          =================================== */

          <div className="rounded-lg border border-dashed border-[#E8E3D5] py-12 text-center">

            <FiFolder
              size={36}
              className="mx-auto text-[#C9A227]"
            />

            <h3 className="mt-3 font-semibold text-[#171717]">
              No categories yet
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Create your first product category.
            </p>

            <button
              type="button"
              onClick={handleAddCategory}
              className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[#C9A227] px-4 py-2 text-sm font-medium text-[#A88416] transition hover:bg-[#F7F2DF]"
            >
              <FiPlus size={16} />
              Add Category
            </button>

          </div>
        ) : (
          /* ===================================
             TABLE
          =================================== */

          <div className="overflow-x-auto">

            <table className="w-full min-w-[600px]">

              <thead>
                <tr className="border-b border-[#E8E3D5] text-left">

                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    ID
                  </th>

                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Category
                  </th>

                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Slug
                  </th>

                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Actions
                  </th>

                </tr>
              </thead>

              <tbody>

                {categories.map((category) => (
                  <tr
                    key={category.id}
                    className="border-b border-[#F0ECE2] last:border-b-0 hover:bg-[#FAF9F5]"
                  >

                    <td className="px-4 py-4 text-sm text-gray-500">
                      #{category.id}
                    </td>

                    <td className="px-4 py-4">

                      <div className="flex items-center gap-3">

                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F7F2DF] text-[#C9A227]">
                          <FiFolder size={17} />
                        </div>

                        <span className="font-medium text-[#171717]">
                          {category.name}
                        </span>

                      </div>

                    </td>

                    <td className="px-4 py-4">

                      <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs text-gray-600">
                        {category.slug}
                      </span>

                    </td>

                    <td className="px-4 py-4">

                      <div className="flex justify-end gap-2">

                        <button
                          type="button"
                          onClick={() =>
                            handleEditCategory(
                              category
                            )
                          }
                          title="Edit category"
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E8E3D5] text-gray-600 transition hover:border-[#C9A227] hover:bg-[#F7F2DF] hover:text-[#A88416]"
                        >
                          <FiEdit2 size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteCategory(
                              category
                            )
                          }
                          title="Delete category"
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 text-red-500 transition hover:bg-red-50"
                        >
                          <FiTrash2 size={16} />
                        </button>

                      </div>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {/* =====================================
          ADD / EDIT MODAL
      ===================================== */}

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-[#E8E3D5] px-5 py-4">

              <div>
                <h2 className="text-lg font-bold text-[#171717]">
                  {editingCategory
                    ? "Edit Category"
                    : "Add Category"}
                </h2>

                <p className="mt-0.5 text-xs text-gray-500">
                  {editingCategory
                    ? "Update category details."
                    : "Create a new product category."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FiX size={20} />
              </button>

            </div>

            {/* MODAL BODY */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-5"
            >

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* NAME */}

              <div>

                <label
                  htmlFor="category-name"
                  className="mb-2 block text-sm font-medium text-[#171717]"
                >
                  Category Name
                </label>

                <input
                  id="category-name"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Example: Traditional Snacks"
                  maxLength={50}
                  disabled={saving}
                  className="w-full rounded-lg border border-[#E8E3D5] px-4 py-3 text-sm outline-none transition focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/10 disabled:bg-gray-100"
                />

              </div>

              {/* SLUG */}

              <div>

                <div className="mb-2 flex items-center justify-between">

                  <label
                    htmlFor="category-slug"
                    className="text-sm font-medium text-[#171717]"
                  >
                    Slug
                  </label>

                  <button
                    type="button"
                    onClick={generateSlug}
                    disabled={
                      saving || !form.name.trim()
                    }
                    className="text-xs font-medium text-[#A88416] hover:underline disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Generate from name
                  </button>

                </div>

                <input
                  id="category-slug"
                  type="text"
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  placeholder="traditional-snacks"
                  maxLength={60}
                  disabled={saving}
                  className="w-full rounded-lg border border-[#E8E3D5] px-4 py-3 text-sm outline-none transition focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/10 disabled:bg-gray-100"
                />

                <p className="mt-1.5 text-xs text-gray-400">
                  Lowercase letters, numbers, and hyphens only.
                </p>

              </div>

              {/* BUTTONS */}

              <div className="flex gap-3 pt-2">

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="flex-1 rounded-lg border border-[#E8E3D5] px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-lg bg-[#C9A227] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#A88416] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingCategory
                    ? "Update Category"
                    : "Create Category"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
};

export default AdminCategories;