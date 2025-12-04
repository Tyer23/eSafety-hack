import type { ReactNode } from "react";

export const metadata = {
  title: "Google",
  description: "Search the web"
};

export default function ChildLayout({ children }: { children: ReactNode }) {
  // Child pages render as standalone browser - no parent app styling
  // Route group (child) means this won't show parent header/footer
  return <>{children}</>;
}
