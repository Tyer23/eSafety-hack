import "./globals.css";
import type { ReactNode } from "react";
import ConditionalLayout from "@/components/ConditionalLayout";
import type { Metadata } from "next";
import Navigation from "../components/Navigation";
import Logo from "../components/Logo";

export const metadata: Metadata = {
  title: "KindNet - Parent Dashboard",
  description: "AI-powered digital literacy companion for families",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen text-gray-900">
        <ConditionalLayout>{children}</ConditionalLayout>
        <div className="min-h-screen flex flex-col">
          {/* Desktop Header - hidden on mobile */}
          <header className="hidden md:block bg-white border-b border-gray-200">
            <div className="mx-auto max-w-6xl px-4 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Logo variant="horizontal" size="md" />
              <Navigation />
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 bg-gray-50">
            {/* Desktop: max-width container with padding */}
            {/* Mobile: full width, no padding (handled by ResponsiveLayout) */}
            <div className="md:mx-auto md:max-w-6xl md:px-4 md:py-6">
              {children}
            </div>
          </main>

          {/* Footer - appears above mobile nav on mobile, at bottom on desktop */}
          <footer className="border-t border-gray-200 text-footnote text-gray-500 py-3 text-center bg-white/40 backdrop-blur-sm pb-20 md:mb-0">
            Built for first‑time phone parents · This is a demo, not a real
            safety product.
          </footer>
        </div>
      </body>
    </html>
  );
}


