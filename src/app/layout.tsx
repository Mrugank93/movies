import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Auth from "@/components/Auth";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "700", "600"] });

export const metadata: Metadata = {
  title: "My Movie",
  description: "A simple movie app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <Auth>
          {children}
        </Auth>
        <Footer />
      </body>
    </html >
  );
}