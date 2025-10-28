import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { TRPCProvider } from "./providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Articler",
    template: "%s | Articler",
  },
  description:
    "A modern multi-user blogging platform built with Next.js, tRPC, Drizzle ORM, and PostgreSQL. Create, manage, and share your stories.",
  keywords: [
    "blog",
    "blogging platform",
    "Next.js",
    "tRPC",
    "TypeScript",
    "markdown",
  ],
  authors: [{ name: "Blog Platform" }],
  creator: "Blog Platform",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    title: "Blog Platform",
    description:
      "A modern multi-user blogging platform built with Next.js, tRPC, and PostgreSQL",
    siteName: "Blog Platform",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog Platform",
    description:
      "A modern multi-user blogging platform built with Next.js, tRPC, and PostgreSQL",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <TRPCProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </TRPCProvider>
      </body>
    </html>
  );
}
