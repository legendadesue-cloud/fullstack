import StoreProvider from "@/src/provider";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ARMSLENGTH",
  description: "Discover volunteer opportunities and make an impact.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
