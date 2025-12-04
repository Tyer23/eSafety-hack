"use client";

import { useEffect, useMemo, useState } from "react";
import { Button, Badge, ChatBubble } from "@/components/ui";
import { Send } from "lucide-react";
import { ParentBehaviourData } from "@/lib/types";

interface ChatMessage {
  id: number;
  from: "parent" | "assistant";
  text: string;
  timestamp?: string;
  highlights?: {
    weeklySummary: string;
    focusTheme: string;
    positiveProgress: string[];
    gentleFlags: string[];
  };
}

interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  lastMessage: string;
}

export default function ParentChatPanel() {
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [parentData, setParentData] = useState<ParentBehaviourData | null>(null);
  const [selectedChildId, setSelectedChildId] = useState<string>("");
  const [latestVideoPlan, setLatestVideoPlan] = useState<{
    title: string;
    prompt: string;
    status: string;
    note?: string;
  } | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      from: "assistant",
      text: "Hi! I can help you understand your child's online patterns in plain language. Try asking 'How is Jamie doing online this week?'"
    }
  ]);

  // Mock previous chat sessions
  const [chatSessions] = useState<ChatSession[]>([
    {
      id: "1",
      title: "Jamie's online behavior",
      messages: [],
      lastMessage: "How is Jamie doing online this week?"
    },
    {
      id: "2",
      title: "Privacy concerns",
      messages: [],
      lastMessage: "Has Emma shared any personal information?"
    },
    {
      id: "3",
      title: "Digital wellbeing",
      messages: [],
      lastMessage: "What's the screen time pattern?"
    }
  ]);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch("/api/parent/summary");
        const data: ParentBehaviourData = await response.json();
        setParentData(data);
        const defaultChild = data.children[0];
        setSelectedChildId(defaultChild?.id || "");

        setMessages((prev) => {
          if (prev.length > 1) return prev;
          return [
            prev[0],
            {
              id: prev[0].id + 1,
              from: "assistant",
              text: `Pulled from this week's signals: ${defaultChild?.weeklySummary || "Data still loading."} I will keep the guidance aligned with eSafety.gov.au's focus on reassurance and practical next steps.`,
            }
          ];
        });
      } catch (error) {
        console.error("Failed to load parent summary", error);
      }
    };
    load();
  }, []);

  const selectedChild = useMemo(
    () => parentData?.children.find((child) => child.id === selectedChildId) || parentData?.children[0] || null,
    [parentData, selectedChildId]
  );

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    setIsSending(true);

    const nextId = messages.length ? messages[messages.length - 1].id + 1 : 1;
    const parentMessage: ChatMessage = {
      id: nextId,
      from: "parent",
      text: trimmed
    };

    setMessages((prev) => [...prev, parentMessage]);
    setInput("");

    fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: trimmed, childId: selectedChild?.id }),
    })
      .then(async (response) => {
        const payload = await response.json();
        const reply: ChatMessage = {
          id: parentMessage.id + 1,
          from: "assistant",
          text: payload?.reply || "I could not load advice right now, but I'm still here to listen.",
          highlights: payload?.highlights,
        };
        setMessages((prev) => [...prev, reply]);
        setLatestVideoPlan(payload?.videoPlan || null);
      })
      .catch(() => {
        const reply: ChatMessage = {
          id: parentMessage.id + 1,
          from: "assistant",
          text: "I hit a snag while drafting guidance. Please try again in a moment.",
        };
        setMessages((prev) => [...prev, reply]);
      })
      .finally(() => setIsSending(false));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex bg-gray-50">
      {/* Sidebar for previous chats - hidden on mobile */}
      <div className="hidden flex w-64 border-r border-gray-200 bg-white p-4 flex-col">
        <h3 className="text-subhead font-semibold text-gray-900 mb-4">Previous chats</h3>
        <div className="flex-1 overflow-y-auto space-y-2">
          {chatSessions.map((session) => (
            <button
              key={session.id}
              className="w-full text-left p-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
            >
              <div className="text-footnote font-medium text-gray-900 mb-1">
                {session.title}
              </div>
              <div className="text-[11px] text-gray-500 truncate">
                {session.lastMessage}
              </div>
            </button>
          ))}
        </div>
        <Button className="mt-4 w-full">
          New chat
        </Button>
      </div>

      {/* Main chat area + video sidebar */}
      <div className="flex-1 grid lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)] gap-4 bg-gray-50 p-4 md:p-6 min-h-0">
        {/* Header - hidden on mobile (shown in MobileHeader instead) */}
        <div className="flex flex-col min-h-0">
          <div className="mb-4 hidden md:flex items-center justify-between gap-3">
            <div>
              <h2 className="text-title-2 font-semibold text-gray-900">
                Ask KindNet
              </h2>
              <p className="text-footnote text-gray-500">Grounded in eSafety-style reassurance and privacy-first coaching.</p>
            </div>
            <div className="flex items-center gap-2">
              {parentData?.children?.length ? (
                <select
                  value={selectedChildId}
                  onChange={(event) => setSelectedChildId(event.target.value)}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blurple"
                >
                  {parentData.children.map((child) => (
                    <option key={child.id} value={child.id}>
                      {child.name}
                    </option>
                  ))}
                </select>
              ) : null}
              <Badge variant="default">AI Assistant</Badge>
            </div>
          </div>

          {/* Chat messages - mobile-first spacing */}
          <div className="mb-4 flex flex-1 flex-col overflow-y-auto rounded-xl border border-gray-200 bg-white p-0 min-h-0">
            {messages.map((message) => (
              <ChatBubble
                key={message.id}
                variant={message.from === "parent" ? "parent" : "ai"}
                message={message.text}
                timestamp={message.timestamp}
                avatarUrl={message.from === "assistant" ? "https://api.dicebear.com/7.x/bottts/svg?seed=kindnet" : undefined}
              />
            ))}
          </div>

          {/* Input area - mobile-first with touch-friendly sizing */}
          <div className="space-y-2 sticky bottom-0 bg-gray-50 pt-2 shrink-0">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              rows={2}
              className="w-full resize-none rounded-xl border border-gray-200 bg-white px-3 py-3 md:px-4 text-body text-gray-800 placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-blurple focus:ring-offset-2 focus:border-blurple transition-colors"
              placeholder="Ask about Emma's week..."
            />
            <div className="flex items-center justify-between gap-2">
              <span className="hidden md:inline text-[11px] text-gray-500">
                Press Enter to send, Shift+Enter for a new line.
              </span>
              <Button
                onClick={handleSend}
                size="default"
                className="ml-auto"
                aria-label="Send"
                disabled={isSending}
              >
                <Send className="w-4 h-4" />
                <span className="hidden md:inline">{isSending ? "Thinking..." : "Send"}</span>
              </Button>
            </div>
          </div>
        </div>

        <aside className="hidden lg:block rounded-xl border border-gray-200 bg-white p-4 shadow-sm min-h-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-subhead font-semibold text-gray-900">Sora video plan</h3>
            <Badge variant="outline">{latestVideoPlan ? "mocked" : "off"}</Badge>
          </div>
          {latestVideoPlan ? (
            <>
              <p className="text-sm text-gray-700 leading-relaxed">
                Ready to send to OpenAI Sora once connected. Currently returning a mock prompt only.
              </p>
              <div className="mt-3 space-y-2 text-sm text-gray-800">
                <div>
                  <div className="text-[11px] uppercase tracking-wide text-gray-500">Title</div>
                  <div className="font-semibold">{latestVideoPlan.title}</div>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wide text-gray-500">Prompt</div>
                  <div className="text-gray-800">{latestVideoPlan.prompt}</div>
                </div>
                {latestVideoPlan.note && (
                  <div className="text-[11px] text-gray-500">{latestVideoPlan.note}</div>
                )}
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-700 leading-relaxed">
              Ask for a video (e.g., “Can you draft a Sora video for this?”) and we will prep a prompt here.
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}
