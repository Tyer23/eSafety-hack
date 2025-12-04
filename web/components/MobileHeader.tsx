"use client";

import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { ChevronLeftIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

interface MobileHeaderProps {
  title: string;
  showBackButton?: boolean;
  backHref?: string;
  rightAction?: React.ReactNode;
  className?: string;
}

export default function MobileHeader({
  title,
  showBackButton = false,
  backHref,
  rightAction,
  className,
}: MobileHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (backHref) {
      router.push(backHref);
    } else {
      router.back();
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 bg-white border-b border-gray-200 md:hidden",
        className
      )}
    >
      <div className="flex items-center justify-between h-14 px-4">
        {/* Left: Back button or spacer */}
        <div className="flex items-center min-w-[44px]">
          {showBackButton && (
            <button
              onClick={handleBack}
              className="flex items-center justify-center w-11 h-11 -ml-2 text-blurple rounded-lg transition-colors active:bg-gray-100"
              aria-label="Go back"
            >
              <Icon icon={ChevronLeftIcon} size="lg" strokeWidth={2.5} decorative={false} />
            </button>
          )}
        </div>

        {/* Center: Title */}
        <h1 className="flex-1 text-center text-body font-semibold text-gray-900 tracking-tight px-2 truncate">
          {title}
        </h1>

        {/* Right: Action or spacer */}
        <div className="flex items-center justify-end min-w-[44px]">
          {rightAction}
        </div>
      </div>
    </header>
  );
}
