import type { ReactNode } from "react";

export const metadata = {
  title: "Google",
  description: "Search the web"
};

export default function ChildLayout({ children }: { children: ReactNode }) {
  // Child pages render as standalone browser - no parent app styling
  // The ConditionalLayout will detect this route and render without header/footer
  return <>{children}</>;
}
