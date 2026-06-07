import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function RootLayout({ children }) {
  return (
    <html>
      <body className={`${inter.variable} ${inter.className}`}>{children}</body>
    </html>
  );
}
