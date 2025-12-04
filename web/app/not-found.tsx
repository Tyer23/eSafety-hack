import Link from "next/link";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Red Jellybeat - shocked/alarmed expression */}
        <div className="flex justify-center">
          <Logo variant="icon" jellybeatVariant="red" size="xl" />
        </div>

        {/* Error message */}
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
            404
          </h1>
          <h2 className="text-title-2 font-semibold text-gray-900">
            Page not found
          </h2>
          <p className="text-body text-gray-600 leading-relaxed">
            Oops! The page you&apos;re looking for seems to have drifted away. Let&apos;s get you back to safety.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link href="/parent">Go to Dashboard</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Go to Login</Link>
          </Button>
        </div>

        {/* Helpful links */}
        <div className="pt-4 border-t border-gray-200">
          <p className="text-footnote text-gray-500">
            Need help?{" "}
            <Link href="/parent" className="text-blurple hover:underline font-medium">
              Contact support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
