import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiAlertCircle,
  FiCheck,
  FiEdit2,
  FiHome,
  FiLoader,
  FiMapPin,
  FiPhone,
  FiPlus,
  FiSave,
  FiTrash2,
  FiUser,
  FiX,
} from "react-icons/fi";

import Navbar from "../components/Navbar";

import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} from "../services/addressService";

const initialForm = {
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
  isDefault: false,
};

const Addresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState(initialForm);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [editingId, setEditingId] = useState(null);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const resetForm = () => {
    setForm(initialForm);
  };

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAddresses(token);

      setAddresses(data.addresses);
    } catch (error) {
      console.error("Fetch addresses error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      setError("Please login to manage your addresses.");
      setLoading(false);
      return;
    }

    fetchAddresses();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const data = await createAddress(form, token);

      setAddresses((previousAddresses) => [
        ...previousAddresses,
        data.address,
      ]);

      setMessage("Address added successfully!");
      resetForm();
    } catch (error) {
      console.error("Create address error:", error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (address) => {
    setEditingId(address.id);

    setForm({
      fullName: address.fullName,
      phone: address.phone,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || "",
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      isDefault: address.isDefault,
    });

    setError("");
    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (editingId === null) {
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const data = await updateAddress(
        editingId,
        form,
        token
      );

      setAddresses((previousAddresses) =>
        previousAddresses.map((address) =>
          address.id === editingId
            ? data.address
            : address
        )
      );

      setMessage("Address updated successfully!");

      setEditingId(null);
      resetForm();
    } catch (error) {
      console.error("Update address error:", error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    resetForm();

    setError("");
    setMessage("");
  };

  const handleDelete = async (addressId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this address?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(addressId);
      setError("");
      setMessage("");

      await deleteAddress(addressId, token);

      setAddresses((previousAddresses) =>
        previousAddresses.filter(
          (address) => address.id !== addressId
        )
      );

      if (editingId === addressId) {
        setEditingId(null);
        resetForm();
      }

      setMessage("Address deleted successfully!");
    } catch (error) {
      console.error("Delete address error:", error);
      setError(error.message);
    } finally {
      setDeletingId(null);
    }
  };

  // -----------------------------------------
  // Loading
  // -----------------------------------------

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="min-h-[80vh] bg-[#FAF9F5]">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-24">
            <FiLoader className="animate-spin text-4xl text-[#C9A227]" />

            <p className="mt-4 text-sm font-medium text-gray-600">
              Loading your addresses...
            </p>
          </div>
        </main>
      </>
    );
  }

  // -----------------------------------------
  // Main
  // -----------------------------------------

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#FAF9F5]">
        {/* Header */}
        <section className="border-b border-[#E8E3D5] bg-white">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F7F2DF] text-[#A88416]">
                <FiMapPin className="text-xl" />
              </div>

              <div>
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#A88416]">
                  Delivery Information
                </p>

                <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  My Addresses
                </h1>

                <p className="mt-2 text-sm text-gray-600">
                  Manage your delivery addresses for a
                  faster checkout experience.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          {/* Messages */}

          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
              <FiAlertCircle className="mt-0.5 shrink-0 text-lg" />

              <p>{error}</p>
            </div>
          )}

          {message && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700">
              <FiCheck className="mt-0.5 shrink-0 text-lg" />

              <p>{message}</p>
            </div>
          )}

          <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
            {/* ================================= */}
            {/* ADDRESS FORM */}
            {/* ================================= */}

            <section className="h-fit rounded-2xl border border-[#E8E3D5] bg-white p-6 shadow-sm lg:sticky lg:top-24">
              {/* Form Header */}

              <div className="flex items-center gap-3 border-b border-[#E8E3D5] pb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F7F2DF] text-[#A88416]">
                  {editingId !== null ? (
                    <FiEdit2 />
                  ) : (
                    <FiPlus />
                  )}
                </div>

                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    {editingId !== null
                      ? "Edit Address"
                      : "Add New Address"}
                  </h2>

                  <p className="mt-1 text-xs text-gray-500">
                    {editingId !== null
                      ? "Update your delivery details"
                      : "Add a new delivery location"}
                  </p>
                </div>
              </div>

              {/* Form */}

              <form
                className="mt-6 space-y-5"
                onSubmit={
                  editingId !== null
                    ? handleUpdate
                    : handleSubmit
                }
              >
                {/* Full Name */}

                <div>
                  <label
                    htmlFor="fullName"
                    className="mb-2 block text-sm font-semibold text-gray-800"
                  >
                    Full Name
                  </label>

                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                    <input
                      id="fullName"
                      type="text"
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      placeholder="Enter full name"
                      required
                      className="w-full rounded-lg border border-[#E8E3D5] bg-white py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20"
                    />
                  </div>
                </div>

                {/* Phone */}

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-semibold text-gray-800"
                  >
                    Phone Number
                  </label>

                  <div className="relative">
                    <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      required
                      className="w-full rounded-lg border border-[#E8E3D5] bg-white py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20"
                    />
                  </div>
                </div>

                {/* Address Line 1 */}

                <div>
                  <label
                    htmlFor="addressLine1"
                    className="mb-2 block text-sm font-semibold text-gray-800"
                  >
                    Address Line 1
                  </label>

                  <div className="relative">
                    <FiHome className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                    <input
                      id="addressLine1"
                      type="text"
                      name="addressLine1"
                      value={form.addressLine1}
                      onChange={handleChange}
                      placeholder="House number, street"
                      required
                      className="w-full rounded-lg border border-[#E8E3D5] bg-white py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20"
                    />
                  </div>
                </div>

                {/* Address Line 2 */}

                <div>
                  <label
                    htmlFor="addressLine2"
                    className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-800"
                  >
                    Address Line 2

                    <span className="font-normal text-gray-400">
                      Optional
                    </span>
                  </label>

                  <div className="relative">
                    <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                    <input
                      id="addressLine2"
                      type="text"
                      name="addressLine2"
                      value={form.addressLine2}
                      onChange={handleChange}
                      placeholder="Apartment, landmark, etc."
                      className="w-full rounded-lg border border-[#E8E3D5] bg-white py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20"
                    />
                  </div>
                </div>

                {/* City + State */}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="city"
                      className="mb-2 block text-sm font-semibold text-gray-800"
                    >
                      City
                    </label>

                    <input
                      id="city"
                      type="text"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="City"
                      required
                      className="w-full rounded-lg border border-[#E8E3D5] bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="state"
                      className="mb-2 block text-sm font-semibold text-gray-800"
                    >
                      State
                    </label>

                    <input
                      id="state"
                      type="text"
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      placeholder="State"
                      required
                      className="w-full rounded-lg border border-[#E8E3D5] bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20"
                    />
                  </div>
                </div>

                {/* Postal + Country */}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="postalCode"
                      className="mb-2 block text-sm font-semibold text-gray-800"
                    >
                      Postal Code
                    </label>

                    <input
                      id="postalCode"
                      type="text"
                      name="postalCode"
                      value={form.postalCode}
                      onChange={handleChange}
                      placeholder="Postal code"
                      required
                      className="w-full rounded-lg border border-[#E8E3D5] bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="country"
                      className="mb-2 block text-sm font-semibold text-gray-800"
                    >
                      Country
                    </label>

                    <input
                      id="country"
                      type="text"
                      name="country"
                      value={form.country}
                      onChange={handleChange}
                      placeholder="Country"
                      required
                      className="w-full rounded-lg border border-[#E8E3D5] bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20"
                    />
                  </div>
                </div>

                {/* Default Address */}

                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-[#E8E3D5] bg-[#FAF9F5] p-4 transition-colors duration-200 hover:border-[#C9A227]">
                  <input
                    type="checkbox"
                    name="isDefault"
                    checked={form.isDefault}
                    onChange={handleChange}
                    className="h-4 w-4 accent-[#C9A227]"
                  />

                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Set as default address
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Use this address automatically during
                      checkout.
                    </p>
                  </div>
                </label>

                {/* Buttons */}

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#C9A227] px-5 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-[#A88416] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <FiLoader className="animate-spin" />
                        Saving...
                      </>
                    ) : editingId !== null ? (
                      <>
                        <FiSave />
                        Update Address
                      </>
                    ) : (
                      <>
                        <FiPlus />
                        Add Address
                      </>
                    )}
                  </button>

                  {editingId !== null && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      disabled={saving}
                      className="flex items-center justify-center gap-2 rounded-lg border border-[#E8E3D5] bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <FiX />
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </section>

            {/* ================================= */}
            {/* SAVED ADDRESSES */}
            {/* ================================= */}

            <section>
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Saved Addresses
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {addresses.length}{" "}
                    {addresses.length === 1
                      ? "address"
                      : "addresses"}{" "}
                    saved
                  </p>
                </div>

                <div className="flex h-10 min-w-10 items-center justify-center rounded-full bg-[#F7F2DF] px-3 text-sm font-bold text-[#A88416]">
                  {addresses.length}
                </div>
              </div>

              {addresses.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#C9A227] bg-white px-6 py-16 text-center shadow-sm">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F7F2DF] text-[#C9A227]">
                    <FiMapPin className="text-2xl" />
                  </div>

                  <h3 className="mt-5 text-xl font-bold text-gray-900">
                    No addresses yet
                  </h3>

                  <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
                    Add your first delivery address using
                    the form to the left.
                  </p>
                </div>
              ) : (
                <div className="grid gap-5 xl:grid-cols-2">
                  {addresses.map((address) => {
                    const isDeleting =
                      deletingId === address.id;

                    return (
                      <article
                        key={address.id}
                        className={`group relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                          address.isDefault
                            ? "border-[#C9A227]"
                            : "border-[#E8E3D5] hover:border-[#C9A227]"
                        }`}
                      >
                        {/* Default Top Border */}

                        {address.isDefault && (
                          <div className="absolute inset-x-0 top-0 h-1 bg-[#C9A227]" />
                        )}

                        {/* Card Header */}

                        <div className="flex items-start justify-between gap-4">
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F7F2DF] text-sm font-bold text-[#A88416]">
                              {address.fullName
                                ?.charAt(0)
                                ?.toUpperCase()}
                            </div>

                            <div className="min-w-0">
                              <h3 className="truncate font-bold text-gray-900">
                                {address.fullName}
                              </h3>

                              <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
                                <FiPhone />

                                <span>
                                  {address.phone}
                                </span>
                              </div>
                            </div>
                          </div>

                          {address.isDefault && (
                            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#F7F2DF] px-2.5 py-1 text-xs font-bold text-[#A88416]">
                              <FiCheck />
                              Default
                            </span>
                          )}
                        </div>

                        {/* Address Details */}

                        <div className="mt-5 space-y-3 border-t border-[#E8E3D5] pt-5">
                          <div className="flex gap-3">
                            <FiHome className="mt-1 shrink-0 text-[#C9A227]" />

                            <p className="text-sm leading-6 text-gray-600">
                              {address.addressLine1}

                              {address.addressLine2 && (
                                <>
                                  {", "}
                                  {address.addressLine2}
                                </>
                              )}
                            </p>
                          </div>

                          <div className="flex gap-3">
                            <FiMapPin className="mt-1 shrink-0 text-[#C9A227]" />

                            <p className="text-sm leading-6 text-gray-600">
                              {address.city},{" "}
                              {address.state}{" "}
                              {address.postalCode}
                            </p>
                          </div>

                          <div className="flex gap-3">
                            <span className="mt-1 shrink-0 text-sm text-[#C9A227]">
                              ◉
                            </span>

                            <p className="text-sm text-gray-600">
                              {address.country}
                            </p>
                          </div>
                        </div>

                        {/* Actions */}

                        <div className="mt-5 flex gap-3 border-t border-[#E8E3D5] pt-5">
                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(address)
                            }
                            disabled={isDeleting}
                            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#E8E3D5] px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all duration-200 hover:border-[#C9A227] hover:bg-[#F7F2DF] hover:text-[#A88416] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <FiEdit2 />
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(address.id)
                            }
                            disabled={isDeleting}
                            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition-all duration-200 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isDeleting ? (
                              <FiLoader className="animate-spin" />
                            ) : (
                              <FiTrash2 />
                            )}

                            {isDeleting
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}

              {/* Checkout Link */}

              <div className="mt-6">
                <Link
                  to="/checkout"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#A88416] transition-colors duration-200 hover:text-[#80650F]"
                >
                  ← Back to Checkout
                </Link>
              </div>
            </section>
          </div>
        </section>
      </main>
    </>
  );
};

export default Addresses;