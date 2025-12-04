import Logo from "./Logo";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function LoadingState({
  message = "Loading...",
  size = "md",
  className,
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 p-8",
        className
      )}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      {/* Amber Jellybeat with pulse animation */}
      <div className="animate-pulse">
        <Logo
          variant="icon"
          jellybeatVariant="amber"
          size={size}
        />
      </div>

      {/* Loading message */}
      {message && (
        <p className="text-subhead text-gray-600 font-medium text-center">
          {message}
        </p>
      )}

      {/* Screen reader only text */}
      <span className="sr-only">{message}</span>
    </div>
  );
}
