import Link from "next/link";

export default function HomePage() {
  return (
    <div className="grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-start">
      <section className="space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300 ring-1 ring-emerald-500/30">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          MVP prototype &middot; Local-only demo
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Log in to your <span className="text-emerald-400">Parent</span>{" "}
            dashboard
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
            This demo shows how parents might see privacy‑respecting summaries
            of their child&apos;s digital patterns, inspired by the Digital
            Guardian concept. No real data is collected.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 max-w-md shadow-lg shadow-emerald-500/10">
          <form
            className="space-y-4"
            method="POST"
            action="/api/login"
            // Let the client side handle navigation; the API just returns JSON.
          >
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-200">
                Username
              </label>
              <input
                name="username"
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none ring-emerald-500/0 focus:ring-2 focus:ring-emerald-500/80"
                placeholder="e.g. parent_01"
                autoComplete="username"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-200">
                Password
              </label>
              <input
                name="password"
                required
                type="password"
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none ring-emerald-500/0 focus:ring-2 focus:ring-emerald-500/80"
                placeholder="••••"
                autoComplete="current-password"
              />
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <div>
                <div className="font-medium text-slate-200">Demo accounts</div>
                <div>Username: parent_01 · Password: 1234</div>
              </div>
            </div>
            <Link
              href="/parent"
              className="inline-flex w-full items-center justify-center rounded-lg bg-emerald-500 px-3 py-2 text-sm font-medium text-slate-950 shadow-sm shadow-emerald-500/40 transition hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              Log in as parent_01
            </Link>
            <p className="text-[11px] text-slate-500">
              For this MVP, authentication is a simple file‑based check and the
              button above jumps you straight into the parent view.
            </p>
          </form>
        </div>
      </section>

      <section className="space-y-3 rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 p-5 shadow-xl shadow-sky-500/10">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-100">
            How this MVP maps to the spec
          </h2>
          <span className="rounded-full bg-sky-500/15 px-2.5 py-1 text-[11px] font-medium text-sky-300 ring-1 ring-sky-500/30">
            Parent dashboard
          </span>
        </div>
        <ul className="space-y-2 text-xs text-slate-300">
          <li>
            <span className="font-semibold text-emerald-300">
              Pattern view:
            </span>{" "}
            parents see themes (e.g. cyberbullying, personal info) rather than
            raw messages.
          </li>
          <li>
            <span className="font-semibold text-emerald-300">
              AI chat placeholder:
            </span>{" "}
            a chat panel ready for ML integration in the next step.
          </li>
          <li>
            <span className="font-semibold text-emerald-300">
              Local JSON “DB”:
            </span>{" "}
            fake parents, kids, and their risky words are stored in files, no
            real backend yet.
          </li>
        </ul>
        <div className="mt-3 rounded-xl border border-slate-800 bg-slate-900/70 p-3 text-[11px] text-slate-400">
          Next step will be wiring in the ML classification engine and
          real‑time pattern updates.
        </div>
      </section>
    </div>
  );
}


