'use client'

import { useState, useRef, useEffect } from 'react'
import { Button, Badge, ChatBubble, Icon } from '@/components/ui'
import {
  SendIcon,
  MenuIcon,
  PlusIcon,
  SparklesIcon,
} from '@/components/ui/icons'

interface ChatMessage {
  id: number
  from: 'parent' | 'assistant'
  text: string
  timestamp?: string
}

interface ChatSession {
  id: string
  title: string
  messages: ChatMessage[]
  lastMessage: string
}

export default function ParentChatPanel() {
  const [input, setInput] = useState('')
  const [showSidebar, setShowSidebar] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      from: 'assistant',
      text: "Hi! I can help you understand your child's online patterns in plain language. Try asking 'How is Jamie doing online this week?'",
    },
  ])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Mock previous chat sessions
  const [chatSessions] = useState<ChatSession[]>([
    {
      id: '1',
      title: "Jamie's online behavior",
      messages: [],
      lastMessage: 'How is Jamie doing online this week?',
    },
    {
      id: '2',
      title: 'Privacy concerns',
      messages: [],
      lastMessage: 'Has Emma shared any personal information?',
    },
    {
      id: '3',
      title: 'Digital wellbeing',
      messages: [],
      lastMessage: "What's the screen time pattern?",
    },
  ])

  const handleSend = () => {
    const trimmed = input.trim()
    if (!trimmed) return

    const nextId = messages.length ? messages[messages.length - 1].id + 1 : 1
    const parentMessage: ChatMessage = {
      id: nextId,
      from: 'parent',
      text: trimmed,
    }

    // For the MVP we fake the AI response locally; later this will hit an API.
    const reply: ChatMessage = {
      id: nextId + 1,
      from: 'assistant',
      text: "This is a placeholder answer. In the next step we'll plug this panel into the ML backend so it can generate summaries and advice based on your child's patterns.",
    }

    setMessages((prev) => [...prev, parentMessage, reply])
    setInput('')
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="h-full flex bg-gray-50 relative">
      {/* Desktop sidebar for previous chats */}
      <div className="hidden md:flex w-64 border-r border-gray-200 bg-white flex-col">
        <div className="h-full flex flex-col p-4">
          <h3 className="text-subhead font-semibold text-gray-900 mb-4">
            Previous chats
          </h3>
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
          <Button variant="secondary" className="mt-4 w-full">
            <Icon icon={PlusIcon} size="sm" />
            New chat
          </Button>
        </div>
      </div>

      {/* Mobile modal for previous chats - centered, rounded */}
      {showSidebar && (
        <>
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setShowSidebar(false)}
          />

          {/* Centered modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 md:hidden pointer-events-none">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm max-h-[70vh] flex flex-col pointer-events-auto">
              {/* Modal header */}
              <div className="p-6 pb-4 border-b border-gray-100">
                <h3 className="text-title-3 font-semibold text-gray-900">
                  Previous chats
                </h3>
              </div>

              {/* Modal content - scrollable */}
              <div className="flex-1 overflow-y-auto p-6 space-y-2">
                {chatSessions.map((session) => (
                  <button
                    key={session.id}
                    className="w-full text-left p-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
                    onClick={() => setShowSidebar(false)}
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

              {/* Modal footer */}
              <div className="p-6 pt-4 border-t border-gray-100">
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => setShowSidebar(false)}
                >
                  <Icon icon={PlusIcon} size="sm" />
                  New chat
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main chat area - mobile-first responsive */}
      <div className="flex-1 flex flex-col bg-gray-50 p-4 md:p-6 md:pb-6">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex-1">
            <h2 className="text-body md:text-title-2 font-semibold text-gray-900">
              Ask KindNet
            </h2>
          </div>
          <Badge variant="default">
            <span className="flex items-center gap-1.5">
              <Icon icon={SparklesIcon} size="sm" className="text-inherit" />
              <span className="hidden sm:inline">AI Assistant</span>
              <span className="sm:hidden">AI</span>
            </span>
          </Badge>
        </div>

        {/* Chat messages - mobile-first spacing with padding */}
        <div className="mb-4 flex flex-1 flex-col overflow-y-auto rounded-xl border border-gray-200 bg-white py-4 min-h-0">
          {messages.map((message) => (
            <ChatBubble
              key={message.id}
              variant={message.from === 'parent' ? 'parent' : 'ai'}
              message={message.text}
              timestamp={message.timestamp}
              avatarUrl={
                message.from === 'assistant'
                  ? '/images/jellybeat-rainbow-full.png'
                  : undefined
              }
            />
          ))}
          {/* Invisible element at the end for auto-scroll */}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area - mobile-first with touch-friendly sizing */}
        <div className="space-y-4">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            rows={2}
            className="w-full resize-none rounded-xl border border-gray-200 bg-white px-3 py-3 md:px-4 text-body text-gray-800 placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-blurple focus:ring-offset-2 focus:border-blurple transition-colors"
            placeholder="Ask about Emma's week..."
          />
          <div className="space-y-4">
            {/* Main button row */}
            <div className="flex items-center justify-between gap-2">
              <span className="hidden md:inline text-[11px] text-gray-500">
                Press Enter to send, Shift+Enter for a new line.
              </span>
              <div className="flex items-center gap-2 ml-auto">
                <Button
                  variant="secondary"
                  size="default"
                  className="md:hidden"
                  aria-label="New chat"
                >
                  <Icon icon={PlusIcon} size="sm" />
                  <span>New</span>
                </Button>
                <Button onClick={handleSend} size="default" aria-label="Send">
                  <Icon icon={SendIcon} size="sm" />
                  <span>Send</span>
                </Button>
              </div>
            </div>

            {/* Old chats button - below, aligned right */}
            <div className="-mr-4 flex justify-end md:hidden">
              <Button
                variant="ghost"
                size="default"
                onClick={() => setShowSidebar(true)}
                aria-label="View old chats"
              >
                <Icon icon={MenuIcon} size="sm" />
                <span>Previous chats</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
