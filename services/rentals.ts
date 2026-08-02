export const createRental = async (payload: unknown, token: string) => {
  const response = await fetch(
    "https://gearup-backend-api.onrender.com/api/rental_orders",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(payload),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to create rental");
  }

  return result;
};