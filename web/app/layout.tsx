import "./globals.css";
import type { ReactNode } from "react";
import ConditionalLayout from "@/components/ConditionalLayout";

export const metadata = {
  title: "KindNet - Parent Dashboard",
  description: "AI-powered digital literacy companion for families"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen text-gray-900">
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}


