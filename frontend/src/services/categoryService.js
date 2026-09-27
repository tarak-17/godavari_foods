const API_URL = "http://localhost:5050/api";

export const getCategories = async () => {
  const response = await fetch(`${API_URL}/categories`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch categories"
    );
  }

  return data;
};