"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import Logo from "@/components/Logo";

export default function HomePage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"parent" | "child">("parent");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);

      const response = await fetch("/api/login", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.ok && data.user.role === role) {
        // Store user info in sessionStorage for now
        sessionStorage.setItem("user", JSON.stringify(data.user));
        
        // Route based on role
        if (data.user.role === "parent") {
          router.push("/parent");
        } else {
          router.push(`/child/${data.user.username}`);
        }
      } else {
        setError("Invalid username or password for selected role.");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
              Welcome to <span className="text-blurple">KindNet</span>
            </h1>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed max-w-xl">
              Log in as a parent to see your child&apos;s digital patterns, or as a child to explore safely online.
            </p>
          </div>

          {/* Login Form - iOS 18 design system */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 max-w-md shadow-card">
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Role Selection */}
              <div className="space-y-2">
                <label className="text-footnote font-medium text-gray-700">
                  I am a...
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setRole("parent")}
                    className={`flex-1 h-12 rounded-xl border-2 transition-all ${
                      role === "parent"
                        ? "border-blurple bg-blurple-light text-blurple font-semibold"
                        : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    Parent
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("child")}
                    className={`flex-1 h-12 rounded-xl border-2 transition-all ${
                      role === "child"
                        ? "border-blurple bg-blurple-light text-blurple font-semibold"
                        : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    Child
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-footnote font-medium text-gray-700">
                  Username
                </label>
                <input
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full h-12 rounded-xl border border-gray-200 bg-gray-50 px-4 text-body text-gray-900 placeholder:text-gray-500 outline-none focus:bg-white focus:ring-2 focus:ring-blurple focus:ring-offset-2 focus:border-blurple transition-all"
                  placeholder={role === "parent" ? "e.g. parent_01" : "e.g. kid_01"}
                  autoComplete="username"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-footnote font-medium text-gray-700">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full h-12 rounded-xl border border-gray-200 bg-gray-50 px-4 text-body text-gray-900 placeholder:text-gray-500 outline-none focus:bg-white focus:ring-2 focus:ring-blurple focus:ring-offset-2 focus:border-blurple transition-all"
                  placeholder="••••"
                  autoComplete="current-password"
                />
              </div>

              {error && (
                <div className="rounded-lg bg-alert/10 border border-alert/20 px-3 py-2 text-footnote text-alert">
                  {error}
                </div>
              )}

              <div className="rounded-lg bg-blurple-light px-3 py-2 text-footnote text-gray-700">
                <div className="font-semibold text-gray-900">Demo accounts</div>
                <div className="mt-1 space-y-1">
                  {role === "parent" ? (
                    <>
                      <div>Parent: <span className="font-medium">parent_01</span> / <span className="font-medium">1234</span></div>
                    </>
                  ) : (
                    <>
                      <div>Jamie: <span className="font-medium">kid_01</span> / <span className="font-medium">abcd</span></div>
                      <div>Emma: <span className="font-medium">kid_02</span> / <span className="font-medium">efgh</span></div>
                    </>
                  )}
                </div>
              </div>

              {/* iOS 18 button - 48px height for touch target */}
              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center rounded-xl h-12 px-4 text-body font-semibold text-white bg-blurple shadow-sm transition-all hover:bg-blurple-dark active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blurple focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Logging in..." : "Log in"}
              </button>
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
              {role === "parent" ? "Parent dashboard" : "Child interface"}
            </Badge>
          </div>
          <ul className="space-y-2.5 text-footnote md:text-subhead text-gray-600">
            {role === "parent" ? (
              <>
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
              </>
            ) : (
              <>
                <li>
                  <span className="font-semibold text-blurple">
                    Browser-like interface:
                  </span>{" "}
                  children can search and type messages in a safe, guided environment.
                </li>
                <li>
                  <span className="font-semibold text-blurple">
                    Real-time feedback:
                  </span>{" "}
                  the guardian mascot provides gentle guidance as children type.
                </li>
                <li>
                  <span className="font-semibold text-blurple">
                    Personalized experience:
                  </span>{" "}
                  each child sees their own customized interface.
                </li>
              </>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
