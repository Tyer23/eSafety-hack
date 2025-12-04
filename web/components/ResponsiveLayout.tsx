"use client";

import { cn } from "@/lib/utils";
import MobileHeader from "./MobileHeader";
import MobileBottomNav from "./MobileBottomNav";

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  /** Mobile header configuration */
  mobileHeader?: {
    title: string;
    showBackButton?: boolean;
    backHref?: string;
    rightAction?: React.ReactNode;
  };
  /** Whether to show mobile bottom navigation */
  showMobileNav?: boolean;
  /** Additional className for the content wrapper */
  className?: string;
  /** Whether to apply standard page padding (default: true) */
  applyPadding?: boolean;
}

export default function ResponsiveLayout({
  children,
  mobileHeader,
  showMobileNav = true,
  className,
  applyPadding = true,
}: ResponsiveLayoutProps) {
  return (
    <>
      {/* Mobile Header - only shown on mobile */}
      {mobileHeader && <MobileHeader {...mobileHeader} />}

      {/* Main Content */}
      <div
        className={cn(
          // Mobile-first: bottom padding for nav, min height
          showMobileNav && "pb-20 md:pb-0",
          // Desktop: standard padding handled by parent layout
          applyPadding && "px-4 py-5 md:px-0 md:py-0",
          // Mobile header spacing
          mobileHeader && "pt-0 md:pt-0",
          className
        )}
      >
        {children}
      </div>

      {/* Mobile Bottom Navigation - only shown on mobile */}
      {showMobileNav && <MobileBottomNav />}
    </>
  );
}
