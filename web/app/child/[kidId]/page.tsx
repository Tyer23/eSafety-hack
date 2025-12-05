"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";

interface User {
  username: string;
  role: string;
  name: string;
}

export default function ChildBrowserPage() {
  const params = useParams();
  const router = useRouter();
  const kidId = params.kidId as string;
  
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [mascotColor, setMascotColor] = useState<"rainbow" | "green" | "amber" | "red">("rainbow");
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [previousFeedback, setPreviousFeedback] = useState<string>("");

  useEffect(() => {
    // Get user from sessionStorage
    const userStr = sessionStorage.getItem("user");
    if (userStr) {
      const userData = JSON.parse(userStr);
      setUser(userData);
      
      // Verify this is the correct child
      if (userData.username !== kidId || userData.role !== "child") {
        router.push("/");
      }
    } else {
      router.push("/");
    }
  }, [kidId, router]);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    const text = searchQuery.trim();
    if (!text || isLoading) {
      return;
    }

    setIsLoading(true);

    try {
      // Determine age range based on kidId
      // kid_01 = Jamie (9 years old) -> "8-10"
      // kid_02 = Emma (11 years old) -> "11-13"
      const ageRange = kidId === "kid_01" ? "8-10" : "11-13";

      // Prepare data to send to ML backend
      const mlRequest = {
        message: text,
        age_range: ageRange
      };

      console.log("📤 Sending to ML Model:", {
        kidId: kidId,
        text: text,
        ageRange: ageRange,
        timestamp: new Date().toISOString()
      });

      // Call ML backend API via Next.js proxy (avoids CORS issues)
      const response = await fetch("/api/ml/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mlRequest),
      });

      if (!response.ok) {
        throw new Error(`ML API error: ${response.status} ${response.statusText}`);
      }

      const mlResult = await response.json();

      // Console log the full ML response
      console.log("📥 ML Model Response:", mlResult);
      console.log("📊 Classification:", mlResult.classification);
      console.log("🎯 Confidence:", mlResult.confidence);
      console.log("💬 Feedback:", mlResult.feedback);
      console.log("📈 Analysis:", mlResult.analysis);
      console.log("📝 Detected Issues:", mlResult.analysis?.detected_issues);
      console.log("😊 Primary Emotion:", mlResult.analysis?.emotion?.primary_emotion);
      console.log("⚠️ Toxicity Score:", mlResult.analysis?.toxicity?.score);

      // Store the result with kidId for parent dashboard (future use)
      const dataToStore = {
        kidId: kidId,
        username: user?.username,
        text: text,
        timestamp: new Date().toISOString(),
        context: "search",
        mlResult: mlResult
      };
      
      console.log("💾 Data to store for parent dashboard:", dataToStore);

      // Update mascot color based on classification
      const classification = mlResult.classification?.toLowerCase();
      if (classification === "red") {
        setMascotColor("red");
      } else if (classification === "yellow") {
        setMascotColor("amber");
      } else if (classification === "green") {
        setMascotColor("green");
      } else {
        setMascotColor("rainbow");
      }

      // Call Jellybeat agent to generate kid-friendly feedback
      try {
        const jellybeatResponse = await fetch("/api/jellybeat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: text,
            classification: mlResult.classification,
            detectedIssues: mlResult.analysis?.detected_issues || [],
            toxicityScore: mlResult.analysis?.toxicity?.score || 0,
            emotion: mlResult.analysis?.emotion?.primary_emotion || "neutral",
            ageRange: ageRange,
            previousResponse: previousFeedback,
          }),
        });

        if (jellybeatResponse.ok) {
          const jellybeatData = await jellybeatResponse.json();
          setFeedbackMessage(jellybeatData.feedback);
          setPreviousFeedback(jellybeatData.feedback);
          setShowTooltip(true);
        }
      } catch (jellybeatError) {
        console.error("Jellybeat agent error:", jellybeatError);
        setFeedbackMessage("I'm here if you need me! 🌊");
        setShowTooltip(true);
      }

    } catch (error) {
      console.error("❌ Error calling ML model:", error);
      console.error("Error details:", error instanceof Error ? error.message : String(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setSearchQuery(text);
    // Real-time tracking could happen here too if needed
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-sm text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Chrome-like Browser Header */}
      <div className="bg-[#f1f3f4] border-b border-[#dadce0]">
        <div className="max-w-6xl mx-auto px-4 py-2">
          <div className="flex items-center gap-2">
            {/* Chrome Navigation Buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => router.push("/")}
                className="w-6 h-6 rounded-full hover:bg-gray-300 flex items-center justify-center transition-colors"
                aria-label="Back"
              >
                <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className="w-6 h-6 rounded-full hover:bg-gray-300 flex items-center justify-center transition-colors" aria-label="Forward">
                <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button className="w-6 h-6 rounded-full hover:bg-gray-300 flex items-center justify-center transition-colors" aria-label="Reload">
                <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>

            {/* Chrome Address Bar */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleTextInput}
                  placeholder="Search Google or type a URL"
                  className="w-full h-10 pl-10 pr-4 bg-white border border-[#dadce0] rounded-l-full rounded-r-full text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:shadow-[0_2px_5px_1px_rgba(64,60,67,.16)] focus:border-transparent transition-all"
                />
              </div>
            </form>

            {/* Chrome Menu Icons */}
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 rounded-full hover:bg-gray-300 flex items-center justify-center transition-colors" aria-label="Menu">
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Browser Content Area - Google-like */}
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-60px)] bg-white">
        <div className="text-center mb-8">
          <div className="text-6xl sm:text-7xl font-normal mb-6 tracking-tight">
            <span className="text-[#4285f4]">G</span>
            <span className="text-[#ea4335]">o</span>
            <span className="text-[#fbbc05]">o</span>
            <span className="text-[#4285f4]">g</span>
            <span className="text-[#34a853]">l</span>
            <span className="text-[#ea4335]">e</span>
          </div>
        </div>

        {/* Search Box - Google Style */}
        <div className="w-full max-w-2xl px-4">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative flex items-center">
              <div className="absolute left-4">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={handleTextInput}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                placeholder="Search Google or type a URL"
                className="w-full h-12 sm:h-14 pl-12 pr-24 rounded-full border border-gray-300 shadow-sm hover:shadow-md focus:outline-none focus:shadow-lg text-base text-gray-900 placeholder:text-gray-500 transition-shadow"
              />
              <div className="absolute right-4 flex items-center gap-2">
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
                {/* Submit/Enter Button - Hidden CTA for ML */}
                <button
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSearch();
                  }}
                  disabled={isLoading || !searchQuery.trim()}
                  className="px-3 py-1.5 bg-[#4285f4] text-white text-sm font-medium rounded-md hover:bg-[#357ae8] transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4285f4] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Submit search"
                >
                  {isLoading ? "..." : "Enter"}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Google Search Buttons */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-[#f8f9fa] text-sm text-gray-700 rounded-md border border-transparent hover:border-gray-300 hover:shadow-sm transition-all"
          >
            Google Search
          </button>
          <button className="px-4 py-2 bg-[#f8f9fa] text-sm text-gray-700 rounded-md border border-transparent hover:border-gray-300 hover:shadow-sm transition-all">
            I&apos;m Feeling Lucky
          </button>
        </div>

        {/* Footer */}
        <div className="absolute bottom-6 text-center">
          <p className="text-xs text-gray-400 mb-2">
            Built for first-time phone parents · This is a demo, not a real safety product.
          </p>
          <button
            onClick={() => {
              sessionStorage.removeItem("user");
              router.push("/");
            }}
            className="text-xs text-gray-400 hover:text-gray-600 underline transition-colors"
          >
            Log out
          </button>
        </div>
      </div>

      {/* Floating Jellybeat Button */}
      <div className="fixed right-6 top-1/4 z-50 flex flex-col items-end gap-2">
        {/* Tooltip */}
        {showTooltip && (
          <div 
            id="jellybeat-tooltip"
            role="tooltip"
            aria-live="polite"
            className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 max-w-xs animate-in fade-in slide-in-from-bottom-2 duration-200"
          >
            <p className="text-sm text-gray-700">
              {feedbackMessage || "Hi! I'm Jellybeat, your digital buddy. I'm here to help you stay safe online!"}
            </p>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowTooltip(!showTooltip)}
          className="w-16 h-16 rounded-full shadow-lg hover:shadow-xl"
          aria-label="Jellybeat helper"
          aria-describedby={showTooltip ? "jellybeat-tooltip" : undefined}
        >
          <Logo variant="icon" jellybeatVariant={mascotColor} size="lg" />
        </Button>
      </div>
    </div>
  );
}
