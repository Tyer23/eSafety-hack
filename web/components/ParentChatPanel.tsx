"use client";

import { useState } from "react";
import { Button, Badge, ChatBubble } from "@/components/ui";
import { Send } from "lucide-react";

interface ChatMessage {
  id: number;
  from: "parent" | "assistant";
  text: string;
  timestamp?: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  lastMessage: string;
}

export default function ParentChatPanel() {
  const [input, setInput] = useState("");
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

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const nextId = messages.length ? messages[messages.length - 1].id + 1 : 1;
    const parentMessage: ChatMessage = {
      id: nextId,
      from: "parent",
      text: trimmed
    };

    // For the MVP we fake the AI response locally; later this will hit an API.
    const reply: ChatMessage = {
      id: nextId + 1,
      from: "assistant",
      text:
        "This is a placeholder answer. In the next step we'll plug this panel into the ML backend so it can generate summaries and advice based on your child's patterns."
    };

    setMessages((prev) => [...prev, parentMessage, reply]);
    setInput("");
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

      {/* Main chat area - mobile-first responsive */}
      <div className="flex-1 flex flex-col bg-gray-50 p-4 md:p-6">
        {/* Header - hidden on mobile (shown in MobileHeader instead) */}
        <div className="mb-4 hidden md:flex items-center justify-between">
          <div>
            <h2 className="text-title-2 font-semibold text-gray-900">
              Ask KindNet
            </h2>
          </div>
          <Badge variant="default">AI Assistant</Badge>
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
        <div className="space-y-2">
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
            <Button onClick={handleSend} size="default" className="ml-auto">
              <Send className="w-4 h-4" />
              <span className="hidden md:inline">Send</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
