"use client";

import { useState } from "react";

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
    <div className="h-full flex bg-pastel-pink-100">
      {/* Sidebar for previous chats */}
      <div className="w-64 border-r border-slate-200 bg-white p-4 flex flex-col">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Previous chats</h3>
        <div className="flex-1 overflow-y-auto space-y-2">
          {chatSessions.map((session) => (
            <button
              key={session.id}
              className="w-full text-left p-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
            >
              <div className="text-xs font-medium text-slate-900 mb-1">
                {session.title}
              </div>
              <div className="text-[10px] text-slate-500 truncate">
                {session.lastMessage}
              </div>
            </button>
          ))}
        </div>
        <button className="mt-4 w-full rounded-lg bg-pastel-purple-500 text-white px-3 py-2 text-xs font-medium hover:bg-pastel-purple-600">
          New chat
        </button>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col bg-pastel-pink-100 p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Ask KindNet
            </h2>
          </div>
          <span className="rounded-full bg-pastel-purple-100 px-2.5 py-1 text-[11px] font-medium text-pastel-purple-700 ring-1 ring-pastel-purple-200">
            AI Assistant
          </span>
        </div>

        <div className="mb-4 flex flex-1 flex-col gap-2 overflow-y-auto rounded-xl border border-slate-200 bg-pastel-pink-50 p-4 min-h-0">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.from === "parent" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                  message.from === "parent"
                    ? "bg-pastel-purple-500 text-white"
                    : "bg-white text-slate-800 border border-slate-200 shadow-sm"
                }`}
              >
                <div className="mb-1 text-[10px] font-medium opacity-70">
                  {message.from === "parent" ? "You" : "KindNet"}
                </div>
                <div>{message.text}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            rows={2}
            className="w-full resize-none rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none ring-pastel-purple-500/0 focus:ring-2 focus:ring-pastel-purple-500/50"
            placeholder="Ask a question like 'What should I talk to Emma about this weekend?'"
          />
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500">
              Press Enter to send, Shift+Enter for a new line.
            </span>
            <button
              type="button"
              onClick={handleSend}
              className="inline-flex items-center justify-center rounded-lg bg-pastel-purple-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-pastel-purple-600"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
