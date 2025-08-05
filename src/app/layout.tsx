import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Carrier Test Site - Insurance Quotes",
  description: "Test insurance quote website for AI agent testing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}