'use client'

import { useEffect, useState, useRef } from 'react'
import { Button, Badge, ChatBubble, Icon } from '@/components/ui'
import {
  SendIcon,
  PlusIcon,
  SparklesIcon,
  MessageCircleIcon,
  ImageIcon,
  XIcon,
  Trash2Icon,
} from '@/components/ui/icons'
import { ParentBehaviourData } from '@/lib/types'

interface ChatMessage {
  id: number
  from: 'parent' | 'assistant'
  text: string
  timestamp?: string
}

export default function ParentChatPanel() {
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [showPreviousChats, setShowPreviousChats] = useState(false)
  const [showVideoPlan, setShowVideoPlan] = useState(false)
  const [parentData, setParentData] = useState<ParentBehaviourData | null>(null)
  const [selectedChildId, setSelectedChildId] = useState<string>('')
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      from: 'assistant',
      text: "Hi! I can help you understand your child's online patterns in plain language. Try asking 'How is Jamie doing online this week?'",
      timestamp: new Date().toISOString(),
    },
  ])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch('/api/parent/summary')
        const data: ParentBehaviourData = await response.json()
        setParentData(data)
        const defaultChild = data.children[0]
        setSelectedChildId(defaultChild?.id || '')
      } catch (error) {
        console.error('Failed to load parent summary', error)
      }
    }
    load()
  }, [])

  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`
    }
  }, [input])

  const handleSend = () => {
    const trimmed = input.trim()
    if (!trimmed || isSending) return

    setIsSending(true)

    const nextId = messages.length ? messages[messages.length - 1].id + 1 : 1
    const parentMessage: ChatMessage = {
      id: nextId,
      from: 'parent',
      text: trimmed,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, parentMessage])
    setInput('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: trimmed,
        childId: selectedChildId,
      }),
    })
      .then(async (response) => {
        const payload = await response.json()
        const reply: ChatMessage = {
          id: parentMessage.id + 1,
          from: 'assistant',
          text: payload?.reply || "I could not load advice right now, but I'm still here to listen.",
          timestamp: new Date().toISOString(),
        }
        setMessages((prev) => [...prev, reply])
      })
      .catch(() => {
        const reply: ChatMessage = {
          id: parentMessage.id + 1,
          from: 'assistant',
          text: 'I hit a snag while drafting guidance. Please try again in a moment.',
          timestamp: new Date().toISOString(),
        }
        setMessages((prev) => [...prev, reply])
      })
      .finally(() => setIsSending(false))
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="h-full flex bg-gray-50 relative gap-4 p-2 md:p-3">
      <div className="flex-1 flex flex-col min-h-0 rounded-xl border border-gray-200 bg-white shadow-card">
        <div className="flex flex-col min-h-0 flex-1 p-4 md:p-6">
          <div className="mb-2 hidden md:flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {!showPreviousChats && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPreviousChats(true)}
                  aria-label="Show previous chats"
                >
                  <Icon icon={MessageCircleIcon} size="sm" />
                </Button>
              )}
              <h2 className="text-title-2 font-semibold text-gray-900">
                Ask <span className="text-blurple">KindNet</span>
              </h2>
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
              <Badge variant="default">
                <span className="flex items-center gap-1.5">
                  <Icon icon={SparklesIcon} size="sm" className="text-inherit" />
                  <span className="hidden sm:inline">AI Assistant</span>
                  <span className="sm:hidden">AI</span>
                </span>
              </Badge>
            </div>
          </div>

          <div className="mb-2 flex md:hidden items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1">
              {!showPreviousChats && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPreviousChats(true)}
                  aria-label="Show previous chats"
                >
                  <Icon icon={MessageCircleIcon} size="sm" />
                </Button>
              )}
              <h2 className="text-body md:text-title-2 font-semibold text-gray-900">
                Ask <span className="text-blurple">KindNet</span>
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="default">
                <span className="flex items-center gap-1.5">
                  <Icon icon={SparklesIcon} size="sm" className="text-inherit" />
                  <span className="hidden sm:inline">AI Assistant</span>
                  <span className="sm:hidden">AI</span>
                </span>
              </Badge>
            </div>
          </div>

          <div className="flex flex-1 flex-col min-h-0 overflow-hidden">
            <div className="flex-1 overflow-y-auto py-4 min-h-0">
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
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-gray-200 px-4 md:px-6 pt-4 md:pt-6 pb-0 mt-auto">
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={1}
                  className="w-full resize-none rounded-xl border border-gray-200 bg-white pl-3 pr-12 py-2.5 md:pl-4 md:pr-14 md:py-3 text-body text-gray-800 placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-blurple focus:ring-offset-2 focus:border-blurple transition-colors"
                  placeholder="Ask about Emma's week..."
                  style={{ minHeight: '44px', maxHeight: '120px' }}
                />
                <Button
                  onClick={handleSend}
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 md:h-9 md:w-9"
                  aria-label="Send"
                  disabled={isSending || !input.trim()}
                >
                  <Icon icon={SendIcon} size="sm" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

