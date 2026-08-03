import Cookies from "js-cookie";
import { CurrentUser } from "@/types/user.types";

export const login = async (email: string, password: string) => {
  const res = await fetch(
    "https://gearup-backend-api.onrender.com/api/auth/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
};

export const logout = () => {
  Cookies.remove("accessToken");
  window.location.href = "/";
};

export const getCurrentUser = async (): Promise<CurrentUser> => {
  const response = await fetch(
    "https://gearup-backend-api.onrender.com/api/users/me",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("accessToken")}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const data = await response.json();
  return data.data;
};
