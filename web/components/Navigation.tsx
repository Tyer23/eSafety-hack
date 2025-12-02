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
    <nav className="flex items-center gap-2 text-xs font-medium">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`px-3 py-1.5 transition-colors ${
              isActive
                ? "text-pastel-purple-700 font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

