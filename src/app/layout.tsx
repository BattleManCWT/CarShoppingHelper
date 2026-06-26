import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Car TCO Calculator — True Cost of Ownership",
  description:
    "Estimate the true total cost of owning a car over 3 and 5 years — including depreciation, financing, insurance, fuel, maintenance, and repairs.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
