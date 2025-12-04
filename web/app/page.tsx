import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import Logo from "@/components/Logo";

export default function HomePage() {
  return (
    <div className="min-h-screen px-4 py-6 md:px-0 md:py-0 bg-gray-50">
      {/* Mobile-first: single column, stacked layout */}
      <div className="flex flex-col gap-6 md:grid md:gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:items-start">
        {/* Main Login Section */}
        <section className="space-y-5 md:space-y-6">
          {/* Logo - centered on mobile, left-aligned on desktop */}
          <div className="flex justify-center md:justify-start mb-2">
            <Logo variant="horizontal" size="lg" />
          </div>

          <Badge variant="outline" className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blurple animate-pulse" />
            MVP prototype · Local-only demo
          </Badge>

          <div className="space-y-3">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight leading-tight text-gray-900">
              Log in to your <span className="text-blurple">Parent</span>{" "}
              dashboard
            </h1>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed max-w-xl">
              This demo shows how parents might see privacy‑respecting summaries
              of their child&apos;s digital patterns, inspired by the Digital
              Guardian concept. No real data is collected.
            </p>
          </div>

          {/* Login Form - iOS 18 design system */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 max-w-md shadow-card">
            <form
              className="space-y-4"
              method="POST"
              action="/api/login"
              // Let the client side handle navigation; the API just returns JSON.
            >
              <div className="space-y-1.5">
                <label className="text-footnote font-medium text-gray-700">
                  Username
                </label>
                <input
                  name="username"
                  required
                  className="w-full h-12 rounded-xl border border-gray-200 bg-gray-50 px-4 text-body text-gray-900 placeholder:text-gray-500 outline-none focus:bg-white focus:ring-2 focus:ring-blurple focus:ring-offset-2 focus:border-blurple transition-all"
                  placeholder="e.g. parent_01"
                  autoComplete="username"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-footnote font-medium text-gray-700">
                  Password
                </label>
                <input
                  name="password"
                  required
                  type="password"
                  className="w-full h-12 rounded-xl border border-gray-200 bg-gray-50 px-4 text-body text-gray-900 placeholder:text-gray-500 outline-none focus:bg-white focus:ring-2 focus:ring-blurple focus:ring-offset-2 focus:border-blurple transition-all"
                  placeholder="••••"
                  autoComplete="current-password"
                />
              </div>
              <div className="rounded-lg bg-blurple-light px-3 py-2 text-footnote text-gray-700">
                <div className="font-semibold text-gray-900">Demo account</div>
                <div>Username: <span className="font-medium">parent_01</span> · Password: <span className="font-medium">1234</span></div>
              </div>
              {/* iOS 18 button - 48px height for touch target */}
              <Link
                href="/parent"
                className="inline-flex w-full items-center justify-center rounded-xl h-12 px-4 text-body font-semibold text-white bg-blurple shadow-sm transition-all hover:bg-blurple-dark active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blurple focus-visible:ring-offset-2"
              >
                Log in as parent_01
              </Link>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                For this MVP, authentication is a simple file‑based check and the
                button above jumps you straight into the parent view.
              </p>
            </form>
          </div>
        </section>

        {/* Info Section - iOS 18 light design */}
        <section className="space-y-3 rounded-2xl border border-gray-200 bg-white p-4 md:p-5 shadow-card">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <h2 className="text-subhead font-semibold text-gray-900">
              How this MVP maps to the spec
            </h2>
            <Badge variant="secondary" className="self-start md:self-auto">
              Parent dashboard
            </Badge>
          </div>
          <ul className="space-y-2.5 text-footnote md:text-subhead text-gray-600">
            <li>
              <span className="font-semibold text-blurple">
                Pattern view:
              </span>{" "}
              parents see themes (e.g. cyberbullying, personal info) rather than
              raw messages.
            </li>
            <li>
              <span className="font-semibold text-blurple">
                AI chat placeholder:
              </span>{" "}
              a chat panel ready for ML integration in the next step.
            </li>
            <li>
              <span className="font-semibold text-blurple">
                Local JSON "DB":
              </span>{" "}
              fake parents, kids, and their risky words are stored in files, no
              real backend yet.
            </li>
          </ul>
          <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50 p-3 text-[11px] text-gray-600 leading-relaxed">
            Next step will be wiring in the ML classification engine and
            real‑time pattern updates.
          </div>
        </section>
      </div>
    </div>
  );
}


