"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: "/parent", label: "Chat" },
    { href: "/parent/insights", label: "Insights" },
    { href: "/parent/patterns", label: "Patterns & data" },
  ];

  return (
    <nav className="flex items-center gap-2 text-footnote font-medium">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`px-3 py-1.5 transition-colors rounded-lg ${
              isActive
                ? "text-blurple font-semibold bg-blurple/10"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

