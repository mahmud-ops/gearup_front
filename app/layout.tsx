import React from "react";
import Navbar from "@/components/shared/Navbar";
import "./globals.css";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html>
      <body>
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
