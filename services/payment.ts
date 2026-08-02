export const createCheckoutSession = async (
  orderId: string,
  token: string
) => {
  const response = await fetch(
    `https://gearup-backend-api.onrender.com/api/payment/${orderId}`,
    {
      method: "POST",
      headers: {
        Authorization: token,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create checkout session");
  }

  return response.json();
};