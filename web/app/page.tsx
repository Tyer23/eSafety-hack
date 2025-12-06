"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import Logo from "@/components/Logo";
import Footer from "@/components/Footer";

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

  const scrollToLogin = () => {
    const loginSection = document.getElementById('login-section');
    if (loginSection) {
      loginSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-4">
          <Logo variant="horizontal" size="md" jellybeatVariant="kindnet" />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-24 md:px-8 lg:px-16 mt-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Video with circular mask and float shadow */}
          <div className="flex justify-center">
            <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden shadow-float">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              >
                <source src="/images/jellybeat-traffic-vid.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
              KindNet
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Being safe, being kind, asking for help, and making good choices.
            </p>
          </div>

          {/* Login Button */}
          <button
            onClick={scrollToLogin}
            className="inline-flex items-center justify-center rounded-xl h-14 px-8 text-lg font-semibold text-white bg-gray-900 shadow-float transition-all hover:bg-gray-800 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
          >
            Sign In
          </button>
        </div>
      </section>

      {/* Login and Info Sections */}
      <section id="login-section" className="px-4 py-12 md:px-8 lg:px-16 md:py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          {/* Two Cards Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Card 1: For Parents */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-float space-y-4">
              <div className="space-y-3">
                <Badge variant="default">For Parents</Badge>
                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900">
                  Pattern-Based Insights
                </h2>
                <p className="text-body text-gray-600 leading-relaxed">
                  See behavioral themes, not individual messages. We help you understand your child&apos;s digital world while respecting their privacy.
                </p>
              </div>
              <ul className="space-y-2 text-subhead text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-safe mt-0.5">✓</span>
                  <span>AI-powered conversation starters</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-safe mt-0.5">✓</span>
                  <span>Weekly summaries of digital habits</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-safe mt-0.5">✓</span>
                  <span>Privacy-first pattern detection</span>
                </li>
              </ul>
            </div>

            {/* Card 2: For Children */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-float space-y-4">
              <div className="space-y-3">
                <Badge variant="default">For Children</Badge>
                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900">
                  Learn As You Explore
                </h2>
                <p className="text-body text-gray-600 leading-relaxed">
                  A friendly guardian helps you make kind, safe choices online. Learn digital literacy through real-time guidance.
                </p>
              </div>
              <ul className="space-y-2 text-subhead text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-safe mt-0.5">✓</span>
                  <span>Real-time safety guidance</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-safe mt-0.5">✓</span>
                  <span>Learn kindness and digital citizenship</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-safe mt-0.5">✓</span>
                  <span>Build healthy online habits</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Login Form - Centered Below Cards */}
          <div className="mt-12 max-w-md mx-auto rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-float">
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
        </div>
      </section>

      <Footer />
    </div>
  );
}
