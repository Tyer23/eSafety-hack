"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import Navigation from "./Navigation";

export default function ConditionalLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isChildRoute, setIsChildRoute] = useState(false);

  useEffect(() => {
    setIsChildRoute(pathname?.startsWith("/child/") ?? false);
  }, [pathname]);

  // For child routes, render without header/footer - pure browser interface
  if (isChildRoute) {
    return <>{children}</>;
  }

  // For parent routes, render with header/footer
  return (
    <div className="min-h-screen flex flex-col">
      {/* Desktop Header - hidden on mobile */}
      <header className="hidden md:block bg-white border-b border-gray-200">
        <div className="mx-auto max-w-6xl px-4 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-blurple via-blurple-light to-blurple" />
            <div>
              <div className="font-semibold tracking-tight text-gray-900">
                KindNet
              </div>
              <div className="text-footnote text-gray-500">
                Growth-minded, trust-first digital parenting
              </div>
            </div>
          </div>
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

    </div>
  );
}

