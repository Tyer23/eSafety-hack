import Image from "next/image";
import { cn } from "@/lib/utils";

type JellybeatVariant = "rainbow" | "green" | "amber" | "red";
type LogoVariant = "icon" | "horizontal";

interface LogoProps {
  variant?: LogoVariant;
  jellybeatVariant?: JellybeatVariant;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  icon: {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  },
  horizontal: {
    sm: "h-8",
    md: "h-10",
    lg: "h-12",
    xl: "h-16",
  },
};

const jellybeatImages: Record<JellybeatVariant, string> = {
  rainbow: "/images/kindnet-logo.png",
  green: "/images/jellybeat-green-full.png",
  amber: "/images/jellybeat-amber-full.png",
  red: "/images/jellybeat-red-full.png",
};

export default function Logo({
  variant = "horizontal",
  jellybeatVariant = "rainbow",
  size = "md",
  className,
}: LogoProps) {
  const imageSrc = jellybeatImages[jellybeatVariant];

  // Calculate pixel sizes
  const pixelSize = size === "sm" ? 32 : size === "md" ? 40 : size === "lg" ? 48 : 64;

  if (variant === "icon") {
    return (
      <div className={cn("relative flex-shrink-0", sizeClasses.icon[size], className)}>
        <Image
          src={imageSrc}
          alt="Jellybeat mascot"
          width={pixelSize}
          height={pixelSize}
          className="object-contain"
          quality={100}
          priority
        />
      </div>
    );
  }

  // Horizontal lockup
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className={cn("relative flex-shrink-0", sizeClasses.horizontal[size])}>
        <Image
          src={imageSrc}
          alt="Jellybeat mascot"
          width={pixelSize}
          height={pixelSize}
          className="object-contain"
          quality={100}
          priority
        />
      </div>
      <div className="flex flex-col">
        <div
          className={cn(
            "font-semibold tracking-tight text-blurple",
            size === "sm" && "text-base",
            size === "md" && "text-lg",
            size === "lg" && "text-xl",
            size === "xl" && "text-2xl"
          )}
        >
          KindNet
        </div>
      </div>
    </div>
  );
}
