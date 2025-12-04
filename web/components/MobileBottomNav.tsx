"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle, TrendingUp, BarChart3, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function MobileBottomNav() {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      href: "/parent",
      label: "Chat",
      icon: MessageCircle,
    },
    {
      href: "/parent/insights",
      label: "Insights",
      icon: TrendingUp,
    },
    {
      href: "/parent/patterns",
      label: "Patterns",
      icon: BarChart3,
    },
    {
      href: "/settings",
      label: "Settings",
      icon: Settings,
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 pb-[env(safe-area-inset-bottom)] md:hidden"
      role="navigation"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors rounded-xl active:scale-95",
                isActive
                  ? "text-blurple"
                  : "text-gray-500 hover:text-gray-700 active:bg-gray-50"
              )}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className={cn("w-6 h-6", isActive && "fill-blurple/10")} strokeWidth={isActive ? 2.5 : 2} />
              <span className={cn(
                "text-[11px] font-medium leading-none",
                isActive ? "text-blurple" : "text-gray-600"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
