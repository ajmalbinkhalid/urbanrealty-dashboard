import type { Metadata } from "next";
import type { ReactNode } from "react";

import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/auth-context";
import { APP_CONFIG } from "@/utils/app-config";

import "./globals.css";

import localFont from "next/font/local";
import QueryProvider from "@/components/provider/query-provider";
import ProgressBarProvider from "../components/provider/progressbar-provider";

export const inter = localFont({
  src: [
    {
      path: "../fonts/Inter/Inter-VariableFont_opsz,wght.ttf",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "../fonts/Inter/Inter-Italic-VariableFont_opsz,wght.ttf",
      weight: "100 900",
      style: "italic",
    },
  ],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: APP_CONFIG.meta.title,
  description: APP_CONFIG.meta.description,
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html className={"light default"} lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <QueryProvider>
          <ProgressBarProvider>
            <AuthProvider>
              {children}
              <Toaster closeButton />
            </AuthProvider>
          </ProgressBarProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
