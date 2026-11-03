import type { Metadata } from "next";
import SmoothScroll from "@/components/layout/SmoothScroll";
import ScrollProgressBar from "@/components/ui/ScrollProgressBar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Crystal Thread — Luxury Haute Atelier & AI Virtual Try-On",
  description:
    "Clothes that feel as good as they look. European linen, GOTS organic cotton, single-needle precision, and interactive AI drape fitting.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-[#070709] text-[#FFFFFF] selection:bg-[#BFD3E6]/30 selection:text-white">
        <ScrollProgressBar />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
