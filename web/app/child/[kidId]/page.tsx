"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

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

  const handleSearch = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    if (searchQuery.trim()) {
      // Track which child this text is from - kidId is available from params
      const dataToSend = {
        kidId: kidId, // e.g., "kid_01" or "kid_02"
        username: user?.username, // Also store username for reference
        text: searchQuery.trim(),
        timestamp: new Date().toISOString(),
        context: "search" // or "message" depending on where it's used
      };
      
      // In a real app, this would send to backend API for ML analysis
      // Example: await fetch('/api/analyze', { method: 'POST', body: JSON.stringify(dataToSend) })
      console.log("Data to send to ML backend:", dataToSend);
      
      // For demo: this will be sent to backend/CSV later
      // The kidId ensures we can track which child's data this is
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
                  className="px-3 py-1.5 bg-[#4285f4] text-white text-sm font-medium rounded-md hover:bg-[#357ae8] transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4285f4] focus:ring-offset-2"
                  aria-label="Submit search"
                >
                  Enter
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
      </div>
    </div>
  );
}
