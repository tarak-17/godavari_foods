const API_URL = "http://localhost:5050/api";


export const createPayment = async (orderId, token) => {
    const response = await fetch(
      `${API_URL}/payments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderId,
        }),
      }
    );
  
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(
        data.message || "Failed to create payment"
      );
    }
  
    return data;
  };
  
export const createRazorpayOrder = async (orderId, token) => {
  const response = await fetch(
    `${API_URL}/payments/order/${orderId}/razorpay`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create Razorpay order");
  }

  return data;
};

export const verifyPayment = async (
  orderId,
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
  token
) => {
  const response = await fetch(`${API_URL}/payments/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      orderId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Payment verification failed");
  }

  return data;
};