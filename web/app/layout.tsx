import "./globals.css";
import type { ReactNode } from "react";
import Navigation from "../components/Navigation";

export const metadata = {
  title: "KindNet - Parent Dashboard",
  description: "AI-powered digital literacy companion for families"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen text-slate-900">
        <div className="min-h-screen flex flex-col">
          <header className="bg-pastel-pink-50 border-b border-slate-200">
            <div className="mx-auto max-w-6xl px-4 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-pastel-purple-400 via-pastel-pink-400 to-pastel-blue-400" />
                <div>
                  <div className="font-semibold tracking-tight text-slate-900">
                    KindNet
                  </div>
                  <div className="text-xs text-slate-500">
                    Growth-minded, trust-first digital parenting
                  </div>
                </div>
              </div>
              <Navigation />
            </div>
          </header>
          <main className="flex-1 bg-pastel-pink-50">
            <div className="mx-auto max-w-6xl px-4 py-6">{children}</div>
          </main>
          <footer className="border-t border-slate-200 text-xs text-slate-500 py-3 text-center bg-white/40 backdrop-blur-sm">
            Built for first‑time phone parents · This is a demo, not a real
            safety product.
          </footer>
        </div>
      </body>
    </html>
  );
}


