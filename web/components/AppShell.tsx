"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import Navigation from "./Navigation";
import Logo from "./Logo";
import LogoutButton from "./LogoutButton";

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();

  // Routes that should NOT show the navbar/shell
  const isLoginPage = pathname === "/";
  const isChildRoute = pathname.startsWith("/child/");
  const hideShell = isLoginPage || isChildRoute;

  // For login and child routes, render without header/footer
  if (hideShell) {
    return <>{children}</>;
  }

  // For parent routes, render with full shell
  return (
    <div className="min-h-screen flex flex-col">
      {/* Desktop Header - hidden on mobile */}
      <header className="hidden md:block bg-white border-b border-gray-200">
        <div className="mx-auto max-w-6xl px-4 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Logo variant="horizontal" size="md" jellybeatVariant="kindnet" />
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
        <LogoutButton />
      </footer>
    </div>
  );
}
