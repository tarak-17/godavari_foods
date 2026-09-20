const API_URL = "http://localhost:5050/api";

export const getAddresses = async (token) => {
  const response = await fetch(`${API_URL}/addresses`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch addresses"
    );
  }

  return data;
};

export const createAddress = async (address, token) => {
  const response = await fetch(`${API_URL}/addresses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(address),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to create address"
    );
  }

  return data;
};

export const deleteAddress = async (addressId, token) => {
    const response = await fetch(
      `${API_URL}/addresses/${addressId}`,
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
        data.message || "Failed to delete address"
      );
    }
  
    return data;
  };

  export const updateAddress = async (
    addressId,
    address,
    token
  ) => {
    const response = await fetch(
      `${API_URL}/addresses/${addressId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(address),
      }
    );
  
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(
        data.message || "Failed to update address"
      );
    }
  
    return data;
  };