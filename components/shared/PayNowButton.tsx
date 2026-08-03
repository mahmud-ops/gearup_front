"use client";

import { useState } from "react";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { createCheckoutSession } from "@/services/payment";

export const PayNowButton = ({ orderId }: { orderId: string }) => {
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    const token = Cookies.get("accessToken");

    if (!token) {
      alert("Please login to complete your checkout.");
      return;
    }

    setLoading(true);
    try {
      const checkout = await createCheckoutSession(orderId, token);
      window.location.href = checkout.data.paymentUrl;
    } catch (err) {
      console.error("Payment failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handlePay} disabled={loading} className="rounded-lg">
      {loading ? "Processing..." : "Pay Now"}
    </Button>
  );
};
