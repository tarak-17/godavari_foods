
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiImage,
  FiPlus,
  FiTrash2,
  FiSave,
  FiUpload,
} from "react-icons/fi";

const API_URL = "http://localhost:5050/api";

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const initialForm = {
  name: "",
  slug: "",
  description: "",
  price: "",
  stock: "",
  categoryId: "",
};

const initialImage = {
  url: "",
  publicId: null,
  altText: "",
  isPrimary: true,
};

const initialVariant = {
  quantity: "",
  price: "",
  stock: "",
};

const AdminAddProduct = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [form, setForm] = useState(initialForm);

  const [image, setImage] = useState(initialImage);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [variants, setVariants] = useState([initialVariant]);

  const [imageUploading, setImageUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // -----------------------------------------
  // Fetch categories
  // -----------------------------------------
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);

        const response = await fetch(`${API_URL}/categories`);
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            data?.message || data?.error || "Failed to load categories."
          );
        }

        const categoryData =
          data?.data?.categories ||
          data?.data ||
          data?.categories ||
          [];

        setCategories(Array.isArray(categoryData) ? categoryData : []);
      } catch (err) {
        setError(err.message || "Failed to load categories.");
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // -----------------------------------------
  // Cleanup image preview
  // -----------------------------------------
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // -----------------------------------------
  // Generic form change
  // -----------------------------------------
  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // -----------------------------------------
  // Image selection
  // -----------------------------------------
  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");
    setSuccess("");

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setError("Only JPG, JPEG, PNG, and WEBP images are allowed.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setError("Image size must be less than 5MB.");
      event.target.value = "";
      return;
    }

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    const previewUrl = URL.createObjectURL(file);

    setImageFile(file);
    setImagePreview(previewUrl);

    // New file means the previous Cloudinary image reference
    // should not be reused.
    setImage((previous) => ({
      ...previous,
      url: "",
      publicId: null,
    }));
  };

  // -----------------------------------------
  // Remove image
  // -----------------------------------------
  const handleRemoveImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(null);
    setImagePreview("");
    setImage(initialImage);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // -----------------------------------------
  // Alt text
  // -----------------------------------------
  const handleAltTextChange = (event) => {
    setImage((previous) => ({
      ...previous,
      altText: event.target.value,
    }));
  };

  // -----------------------------------------
  // Add variant
  // -----------------------------------------
  const handleAddVariant = () => {
    setVariants((previous) => [
      ...previous,
      {
        ...initialVariant,
      },
    ]);
  };

  // -----------------------------------------
  // Remove variant
  // -----------------------------------------
  const handleRemoveVariant = (index) => {
    if (variants.length === 1) {
      return;
    }

    setVariants((previous) =>
      previous.filter((_, variantIndex) => variantIndex !== index)
    );
  };

  // -----------------------------------------
  // Update variant
  // -----------------------------------------
  const handleVariantChange = (index, field, value) => {
    setVariants((previous) =>
      previous.map((variant, variantIndex) =>
        variantIndex === index
          ? {
              ...variant,
              [field]: value,
            }
          : variant
      )
    );
  };

  // -----------------------------------------
  // Generate slug
  // -----------------------------------------
  const generateSlug = (value) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const handleNameChange = (event) => {
    const value = event.target.value;

    setForm((previous) => ({
      ...previous,
      name: value,
      slug: generateSlug(value),
    }));
  };

  // -----------------------------------------
  // Unauthorized handler
  // -----------------------------------------
  const handleUnauthorized = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/admin/login");
  };

  // -----------------------------------------
  // Validate form
  // -----------------------------------------
  const validateForm = () => {
    const name = form.name.trim();
    const slug = form.slug.trim();
    const description = form.description.trim();

    if (name.length < 2 || name.length > 100) {
      return "Product name must be between 2 and 100 characters.";
    }

    if (slug.length < 2 || slug.length > 60) {
      return "Slug must be between 2 and 60 characters.";
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      return "Slug can only contain lowercase letters, numbers, and hyphens.";
    }

    if (description.length > 1000) {
      return "Description must be 1000 characters or less.";
    }

    const price = Number(form.price);

    if (!Number.isFinite(price) || price <= 0) {
      return "Base price must be greater than 0.";
    }

    const stock = Number(form.stock);

    if (!Number.isInteger(stock) || stock < 0) {
      return "Base stock must be a valid non-negative integer.";
    }

    const categoryId = Number(form.categoryId);

    if (!Number.isInteger(categoryId) || categoryId <= 0) {
      return "Please select a valid category.";
    }

    if (!imageFile && !image.url) {
      return "Please select a product image.";
    }

    if (variants.length < 1 || variants.length > 10) {
      return "Product must have between 1 and 10 variants.";
    }

    const quantities = new Set();

    for (let index = 0; index < variants.length; index += 1) {
      const variant = variants[index];

      const quantity = variant.quantity.trim();
      const variantPrice = Number(variant.price);
      const variantStock = Number(variant.stock);

      if (!quantity) {
        return `Variant ${index + 1}: quantity is required.`;
      }

      if (quantity.length > 100) {
        return `Variant ${index + 1}: quantity must be 100 characters or less.`;
      }

      const normalizedQuantity = quantity.toLowerCase();

      if (quantities.has(normalizedQuantity)) {
        return `Variant ${index + 1}: duplicate quantity is not allowed.`;
      }

      quantities.add(normalizedQuantity);

      if (!Number.isFinite(variantPrice) || variantPrice <= 0) {
        return `Variant ${index + 1}: price must be greater than 0.`;
      }

      if (!Number.isInteger(variantStock) || variantStock < 0) {
        return `Variant ${index + 1}: stock must be a valid non-negative integer.`;
      }
    }

    return "";
  };

  // -----------------------------------------
  // Upload product image to Cloudinary
  // -----------------------------------------
  const uploadProductImage = async () => {
    // If no new file was selected but an existing image URL exists,
    // reuse the existing Cloudinary information.
    if (!imageFile) {
      if (image.url) {
        return {
          url: image.url,
          publicId: image.publicId || null,
        };
      }

      throw new Error("Please select a product image.");
    }

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/admin/login");
      throw new Error("Authentication required.");
    }

    const formData = new FormData();

    formData.append("image", imageFile);

    try {
      setImageUploading(true);

      const response = await fetch(`${API_URL}/uploads/image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json().catch(() => ({}));

      if (response.status === 401 || response.status === 403) {
        handleUnauthorized();

        throw new Error(
          data?.message ||
            "Your admin session has expired. Please login again."
        );
      }

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            "Image upload failed."
        );
      }

      const uploadedData =
        data?.data ||
        data?.image ||
        data;

      const uploadedUrl =
        uploadedData?.url ||
        uploadedData?.imageUrl ||
        uploadedData?.secure_url ||
        uploadedData?.path ||
        "";

      const publicId =
        uploadedData?.publicId ||
        uploadedData?.public_id ||
        null;

      if (!uploadedUrl) {
        throw new Error(
          "Image was uploaded, but the server did not return an image URL."
        );
      }

      // Store both Cloudinary URL and publicId in React state.
      setImage((previous) => ({
        ...previous,
        url: uploadedUrl,
        publicId,
      }));

      return {
        url: uploadedUrl,
        publicId,
      };
    } finally {
      setImageUploading(false);
    }
  };

  // -----------------------------------------
  // Submit product
  // -----------------------------------------
  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      handleUnauthorized();
      return;
    }

    try {
      setSaving(true);

      // Step 1:
      // Upload selected image to Cloudinary.
      const uploadedImage = await uploadProductImage();

      const imageUrl = uploadedImage?.url || image.url;

      if (!imageUrl) {
        throw new Error("Product image URL is missing.");
      }

      // Step 2:
      // Prepare product payload.
      const productPayload = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        description: form.description.trim() || undefined,
        price: Number(form.price),
        stock: Number(form.stock),
        categoryId: Number(form.categoryId),

        images: [
          {
            url: imageUrl,
            publicId:
              uploadedImage?.publicId ||
              image.publicId ||
              null,
            altText:
              image.altText.trim() ||
              form.name.trim(),
            isPrimary: true,
          },
        ],

        variants: variants.map((variant) => ({
          quantity: variant.quantity.trim(),
          price: Number(variant.price),
          stock: Number(variant.stock),
        })),
      };

      // Step 3:
      // Send product + Cloudinary image information to backend.
      const response = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productPayload),
      });

      const data = await response.json().catch(() => ({}));

      if (response.status === 401 || response.status === 403) {
        handleUnauthorized();

        throw new Error(
          data?.message ||
            "Your admin session has expired. Please login again."
        );
      }

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            "Failed to create product."
        );
      }

      setSuccess("Product created successfully.");

      setTimeout(() => {
        navigate("/admin/products");
      }, 800);
    } catch (err) {
      setError(
        err.message ||
          "Something went wrong while creating the product."
      );
    } finally {
      setSaving(false);
    }
  };

  const isBusy = saving || imageUploading;

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#171717]">
      {/* Header */}
      <div className="border-b border-[#E8E3D5] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E8E3D5] bg-white text-[#171717] transition hover:border-[#C9A227] hover:text-[#A88416]"
            >
              <FiArrowLeft size={18} />
            </button>

            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#A88416]">
                Admin
              </p>

              <h1 className="mt-1 text-2xl font-semibold">
                Add Product
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
            {/* Left */}
            <div className="space-y-8">
              {/* Basic Information */}
              <section className="rounded-2xl border border-[#E8E3D5] bg-white p-6 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold">
                    Basic Information
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Add the main information about your product.
                  </p>
                </div>

                <div className="space-y-5">
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-medium"
                    >
                      Product Name
                    </label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleNameChange}
                      placeholder="Example: Traditional Mango Pickle"
                      className="w-full rounded-xl border border-[#E8E3D5] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/10"
                    />
                  </div>

                  {/* Slug */}
                  <div>
                    <label
                      htmlFor="slug"
                      className="mb-2 block text-sm font-medium"
                    >
                      Slug
                    </label>

                    <input
                      id="slug"
                      name="slug"
                      type="text"
                      value={form.slug}
                      onChange={handleFormChange}
                      placeholder="traditional-mango-pickle"
                      className="w-full rounded-xl border border-[#E8E3D5] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/10"
                    />

                    <p className="mt-2 text-xs text-gray-500">
                      Use lowercase letters, numbers, and hyphens.
                    </p>
                  </div>

                  {/* Description */}
                  <div>
                    <label
                      htmlFor="description"
                      className="mb-2 block text-sm font-medium"
                    >
                      Description
                    </label>

                    <textarea
                      id="description"
                      name="description"
                      rows={5}
                      value={form.description}
                      onChange={handleFormChange}
                      placeholder="Describe the product..."
                      className="w-full resize-none rounded-xl border border-[#E8E3D5] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/10"
                    />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    {/* Base Price */}
                    <div>
                      <label
                        htmlFor="price"
                        className="mb-2 block text-sm font-medium"
                      >
                        Base Price
                      </label>

                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                          ₹
                        </span>

                        <input
                          id="price"
                          name="price"
                          type="number"
                          min="0"
                          step="0.01"
                          value={form.price}
                          onChange={handleFormChange}
                          placeholder="0.00"
                          className="w-full rounded-xl border border-[#E8E3D5] bg-white py-3 pl-9 pr-4 text-sm outline-none transition focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/10"
                        />
                      </div>
                    </div>

                    {/* Base Stock */}
                    <div>
                      <label
                        htmlFor="stock"
                        className="mb-2 block text-sm font-medium"
                      >
                        Base Stock
                      </label>

                      <input
                        id="stock"
                        name="stock"
                        type="number"
                        min="0"
                        step="1"
                        value={form.stock}
                        onChange={handleFormChange}
                        placeholder="0"
                        className="w-full rounded-xl border border-[#E8E3D5] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/10"
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label
                      htmlFor="categoryId"
                      className="mb-2 block text-sm font-medium"
                    >
                      Category
                    </label>

                    <select
                      id="categoryId"
                      name="categoryId"
                      value={form.categoryId}
                      onChange={handleFormChange}
                      disabled={categoriesLoading}
                      className="w-full rounded-xl border border-[#E8E3D5] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/10 disabled:cursor-not-allowed disabled:bg-gray-50"
                    >
                      <option value="">
                        {categoriesLoading
                          ? "Loading categories..."
                          : "Select a category"}
                      </option>

                      {categories.map((category) => (
                        <option
                          key={category.id}
                          value={category.id}
                        >
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </section>

              {/* Product Image */}
              <section className="rounded-2xl border border-[#E8E3D5] bg-white p-6 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold">
                    Product Image
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Upload a high-quality image for your product.
                  </p>
                </div>

                <div className="space-y-5">
                  {!imagePreview ? (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex min-h-[280px] w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#E8E3D5] bg-[#FAF9F5] px-6 text-center transition hover:border-[#C9A227] hover:bg-[#F7F2DF]"
                    >
                      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#C9A227] shadow-sm">
                        <FiImage size={26} />
                      </div>

                      <p className="text-sm font-semibold">
                        Click to upload product image
                      </p>

                      <p className="mt-2 text-xs text-gray-500">
                        JPG, JPEG, PNG or WEBP · Maximum 5MB
                      </p>
                    </button>
                  ) : (
                    <div className="overflow-hidden rounded-2xl border border-[#E8E3D5] bg-[#FAF9F5]">
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt={image.altText || "Product preview"}
                          className="h-[320px] w-full object-contain"
                        />

                        <div className="absolute right-4 top-4 flex gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              fileInputRef.current?.click()
                            }
                            className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-medium shadow-sm transition hover:bg-[#F7F2DF]"
                          >
                            <FiUpload size={14} />
                            Change
                          </button>

                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-medium text-red-600 shadow-sm transition hover:bg-red-50"
                          >
                            <FiTrash2 size={14} />
                            Remove
                          </button>
                        </div>
                      </div>

                      <div className="border-t border-[#E8E3D5] px-4 py-3">
                        <p className="truncate text-xs text-gray-500">
                          {imageFile?.name}
                        </p>

                        {imageFile && (
                          <p className="mt-1 text-xs text-gray-400">
                            {(imageFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={ACCEPTED_IMAGE_TYPES.join(",")}
                    onChange={handleImageChange}
                    className="hidden"
                  />

                  {/* Alt Text */}
                  <div>
                    <label
                      htmlFor="altText"
                      className="mb-2 block text-sm font-medium"
                    >
                      Image Alt Text
                    </label>

                    <input
                      id="altText"
                      type="text"
                      value={image.altText}
                      onChange={handleAltTextChange}
                      placeholder="Describe the product image"
                      className="w-full rounded-xl border border-[#E8E3D5] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/10"
                    />
                  </div>
                </div>
              </section>

              {/* Variants */}
              <section className="rounded-2xl border border-[#E8E3D5] bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold">
                      Product Variants
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Add different quantities, prices, and stock levels.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddVariant}
                    disabled={variants.length >= 10 || isBusy}
                    className="flex items-center gap-2 rounded-xl border border-[#C9A227] px-4 py-2 text-sm font-medium text-[#A88416] transition hover:bg-[#F7F2DF] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <FiPlus size={16} />
                    Add Variant
                  </button>
                </div>

                <div className="space-y-4">
                  {variants.map((variant, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-[#E8E3D5] bg-[#FAF9F5] p-4"
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <p className="text-sm font-semibold">
                          Variant {index + 1}
                        </p>

                        {variants.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveVariant(index)
                            }
                            disabled={isBusy}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        )}
                      </div>

                      <div className="grid gap-4 md:grid-cols-3">
                        {/* Quantity */}
                        <div>
                          <label className="mb-2 block text-xs font-medium">
                            Quantity
                          </label>

                          <input
                            type="text"
                            value={variant.quantity}
                            onChange={(event) =>
                              handleVariantChange(
                                index,
                                "quantity",
                                event.target.value
                              )
                            }
                            placeholder="250g"
                            className="w-full rounded-xl border border-[#E8E3D5] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/10"
                          />
                        </div>

                        {/* Price */}
                        <div>
                          <label className="mb-2 block text-xs font-medium">
                            Price
                          </label>

                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                              ₹
                            </span>

                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={variant.price}
                              onChange={(event) =>
                                handleVariantChange(
                                  index,
                                  "price",
                                  event.target.value
                                )
                              }
                              placeholder="0.00"
                              className="w-full rounded-xl border border-[#E8E3D5] bg-white py-2.5 pl-8 pr-3 text-sm outline-none transition focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/10"
                            />
                          </div>
                        </div>

                        {/* Stock */}
                        <div>
                          <label className="mb-2 block text-xs font-medium">
                            Stock
                          </label>

                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={variant.stock}
                            onChange={(event) =>
                              handleVariantChange(
                                index,
                                "stock",
                                event.target.value
                              )
                            }
                            placeholder="0"
                            className="w-full rounded-xl border border-[#E8E3D5] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/10"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Sidebar */}
            <aside className="lg:sticky lg:top-6 lg:h-fit">
              <div className="rounded-2xl border border-[#E8E3D5] bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold">
                  Product Summary
                </h2>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#E8E3D5] pb-4">
                    <span className="text-sm text-gray-500">
                      Product
                    </span>

                    <span className="max-w-[180px] truncate text-right text-sm font-medium">
                      {form.name || "Not added"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-[#E8E3D5] pb-4">
                    <span className="text-sm text-gray-500">
                      Category
                    </span>

                    <span className="text-right text-sm font-medium">
                      {categories.find(
                        (category) =>
                          String(category.id) ===
                          String(form.categoryId)
                      )?.name || "Not selected"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-[#E8E3D5] pb-4">
                    <span className="text-sm text-gray-500">
                      Base Price
                    </span>

                    <span className="text-sm font-medium">
                      {form.price
                        ? `₹${Number(form.price).toFixed(2)}`
                        : "₹0.00"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-[#E8E3D5] pb-4">
                    <span className="text-sm text-gray-500">
                      Variants
                    </span>

                    <span className="text-sm font-medium">
                      {variants.length}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Image
                    </span>

                    <span className="text-sm font-medium">
                      {imageFile || image.url
                        ? "Added"
                        : "Not added"}
                    </span>
                  </div>
                </div>

                <div className="mt-6 rounded-xl bg-[#F7F2DF] p-4">
                  <p className="text-xs leading-5 text-[#6F5A16]">
                    Your image will be uploaded to Cloudinary before
                    the product is created. The Cloudinary URL and
                    public ID will be saved with the product.
                  </p>
                </div>
              </div>
            </aside>
          </div>

          {/* Bottom Actions */}
          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[#E8E3D5] pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              disabled={isBusy}
              className="rounded-xl border border-[#E8E3D5] bg-white px-6 py-3 text-sm font-medium transition hover:border-[#C9A227] hover:bg-[#F7F2DF] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isBusy}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#C9A227] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#A88416] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isBusy ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />

                  {imageUploading
                    ? "Uploading Image..."
                    : "Creating Product..."}
                </>
              ) : (
                <>
                  <FiSave size={17} />
                  Create Product
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AdminAddProduct;

