'use client'

import { useEffect, useMemo, useState, useRef } from 'react'
import { Button, Badge, ChatBubble, Icon } from '@/components/ui'
import {
  SendIcon,
  MenuIcon,
  PlusIcon,
  SparklesIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ImageIcon,
  MessageCircleIcon,
  XIcon,
  Trash2Icon,
} from '@/components/ui/icons'
import { ParentBehaviourData } from '@/lib/types'
import {
  loadChatSessions,
  saveChatSession,
  createNewChatSession,
  addMessageToSession,
  getChatSession,
  deleteChatSession,
  type ChatMessage,
  type ChatSession,
} from '@/lib/chatStorage'

export default function ParentChatPanel() {
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [showPreviousChats, setShowPreviousChats] = useState(false)
  const [showVideoPlan, setShowVideoPlan] = useState(false)
  const [parentData, setParentData] = useState<ParentBehaviourData | null>(null)
  const [selectedChildId, setSelectedChildId] = useState<string>('')
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const [latestVideoPlan, setLatestVideoPlan] = useState<{
    title: string
    prompt: string
    status: string
    note?: string
  } | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      from: 'assistant',
      text: "Hi! I can help you understand your child's online patterns in plain language. Try asking 'How is Jamie doing online this week?'",
    },
  ])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Load chat sessions from storage (client-side only)
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const parentId = parentData?.parentId || 'parent_01' // Default for MVP
    const sessions = loadChatSessions(parentId)
    setChatSessions(sessions)
  }, [parentData])

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch('/api/parent/summary')
        const data: ParentBehaviourData = await response.json()
        setParentData(data)
        const defaultChild = data.children[0]
        setSelectedChildId(defaultChild?.id || '')

        setMessages((prev) => {
          if (prev.length > 1) return prev
          return [
            prev[0],
            {
              id: prev[0].id + 1,
              from: 'assistant',
              text: `Pulled from this week's signals: ${defaultChild?.weeklySummary || 'Data still loading.'} I will keep the guidance aligned with eSafety.gov.au's focus on reassurance and practical next steps.`,
            },
          ]
        })
      } catch (error) {
        console.error('Failed to load parent summary', error)
      }
    }
    load()
  }, [])

  const selectedChild = useMemo(
    () =>
      parentData?.children.find((child) => child.id === selectedChildId) ||
      parentData?.children[0] ||
      null,
    [parentData, selectedChildId]
  )

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
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    const parentId = parentData?.parentId || 'parent_01'
    let sessionId = currentSessionId

    // If no current session, create a new one
    if (!sessionId) {
      const newSession = createNewChatSession(parentId, parentMessage, selectedChild?.id)
      sessionId = newSession.id
      setCurrentSessionId(sessionId)
      // Reload sessions to show the new one
      setChatSessions(loadChatSessions(parentId))
    } else {
      // Add message to existing session
      addMessageToSession(parentId, sessionId, parentMessage)
    }

    fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        message: trimmed, 
        childId: selectedChild?.id,
        sessionId: sessionId,
      }),
    })
      .then(async (response) => {
        const payload = await response.json()
        const reply: ChatMessage = {
          id: parentMessage.id + 1,
          from: 'assistant',
          text:
            payload?.reply ||
            "I could not load advice right now, but I'm still here to listen.",
          highlights: payload?.highlights,
          timestamp: new Date().toISOString(),
        }
        setMessages((prev) => [...prev, reply])
        setLatestVideoPlan(payload?.videoPlan || null)

        // Save assistant reply to session
        if (sessionId) {
          addMessageToSession(parentId, sessionId, reply)
          // Reload sessions to update lastMessage
          setChatSessions(loadChatSessions(parentId))
        }
      })
      .catch(() => {
        const reply: ChatMessage = {
          id: parentMessage.id + 1,
          from: 'assistant',
          text: 'I hit a snag while drafting guidance. Please try again in a moment.',
          timestamp: new Date().toISOString(),
        }
        setMessages((prev) => [...prev, reply])

        // Save error reply to session
        if (sessionId) {
          addMessageToSession(parentId, sessionId, reply)
          setChatSessions(loadChatSessions(parentId))
        }
      })
      .finally(() => setIsSending(false))
  }

  const handleNewChat = () => {
    setCurrentSessionId(null)
    setMessages([
      {
        id: 1,
        from: 'assistant',
        text: "Hi! I can help you understand your child's online patterns in plain language. Try asking 'How is Jamie doing online this week?'",
        timestamp: new Date().toISOString(),
      },
    ])
    setLatestVideoPlan(null)
  }

  const handleLoadChat = (sessionId: string) => {
    const parentId = parentData?.parentId || 'parent_01'
    const session = getChatSession(parentId, sessionId)
    
    if (session) {
      setCurrentSessionId(session.id)
      setMessages(session.messages)
      setSelectedChildId(session.childId || selectedChildId)
      setShowPreviousChats(false) // Close sidebar on mobile
    }
  }

  const handleDeleteChat = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation() // Prevent loading the chat when clicking delete
    
    if (confirm('Are you sure you want to delete this chat?')) {
      const parentId = parentData?.parentId || 'parent_01'
      const deleted = deleteChatSession(parentId, sessionId)
      
      if (deleted) {
        // Reload sessions
        setChatSessions(loadChatSessions(parentId))
        
        // If this was the current session, reset to new chat
        if (currentSessionId === sessionId) {
          handleNewChat()
        }
      }
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSend()
    }
  }

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`
    }
  }, [input])

  return (
    <div className="h-full flex bg-gray-50 relative gap-4 p-2 md:p-3">
      {/* Desktop sidebar for previous chats - toggleable */}
      {showPreviousChats && (
        <div className="hidden md:flex w-64 bg-white flex-col rounded-xl shadow-card border border-gray-200 flex-shrink-0">
          <div className="h-full flex flex-col p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-subhead font-semibold text-gray-900">
                Previous chats
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowPreviousChats(false)}
                aria-label="Close previous chats"
              >
                <Icon icon={ChevronLeftIcon} size="sm" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2">
              {chatSessions.length === 0 ? (
                <div className="text-footnote text-gray-500 text-center py-8">
                  No previous chats yet. Start a conversation!
                </div>
              ) : (
                chatSessions.map((session) => (
                  <div
                    key={session.id}
                    className={`group relative w-full rounded-xl border transition-colors ${
                      currentSessionId === session.id
                        ? 'border-blurple bg-blurple/5'
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <button
                      onClick={() => handleLoadChat(session.id)}
                      className="w-full text-left p-3 pr-10"
                    >
                      <div className="text-footnote font-medium text-gray-900 mb-1">
                        {session.title}
                      </div>
                      <div className="text-caption text-gray-500 truncate">
                        {session.lastMessage}
                      </div>
                    </button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => handleDeleteChat(e, session.id)}
                      aria-label="Delete chat"
                    >
                      <Icon icon={Trash2Icon} size="sm" className="text-gray-400 hover:text-alert" />
                    </Button>
                  </div>
                ))
              )}
            </div>
            <Button variant="secondary" className="mt-4 w-full" onClick={handleNewChat}>
              <Icon icon={PlusIcon} size="sm" />
              New chat
            </Button>
          </div>
        </div>
      )}

      {/* Mobile sidebar for previous chats - overlay */}
      {showPreviousChats && (
        <>
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setShowPreviousChats(false)}
          />
          <div className="fixed left-0 top-0 bottom-0 w-80 bg-white rounded-r-3xl rounded-l-xl border-r border-gray-200 shadow-card z-50 md:hidden flex flex-col">
            <div className="h-full flex flex-col p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-subhead font-semibold text-gray-900">
                  Previous chats
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPreviousChats(false)}
                  aria-label="Close previous chats"
                >
                  <Icon icon={XIcon} size="sm" />
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-2">
                {chatSessions.length === 0 ? (
                  <div className="text-footnote text-gray-500 text-center py-8">
                    No previous chats yet. Start a conversation!
                  </div>
                ) : (
                  chatSessions.map((session) => (
                    <div
                      key={session.id}
                      className={`group relative w-full rounded-xl border transition-colors ${
                        currentSessionId === session.id
                          ? 'border-blurple bg-blurple/5'
                          : 'border-gray-200 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <button
                        onClick={() => {
                          handleLoadChat(session.id)
                          setShowPreviousChats(false)
                        }}
                        className="w-full text-left p-3 pr-10"
                      >
                        <div className="text-footnote font-medium text-gray-900 mb-1">
                          {session.title}
                        </div>
                        <div className="text-[11px] text-gray-500 truncate">
                          {session.lastMessage}
                        </div>
                      </button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => handleDeleteChat(e, session.id)}
                        aria-label="Delete chat"
                      >
                        <Icon icon={Trash2Icon} size="sm" className="text-gray-400 hover:text-alert" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
              <Button variant="secondary" className="mt-4 w-full" onClick={handleNewChat}>
                <Icon icon={PlusIcon} size="sm" />
                New chat
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Main chat area and video sidebar container */}
      <div className="flex-1 flex min-h-0 gap-4">
        {/* Main chat area - responsive width */}
        <div className="flex-1 flex flex-col min-h-0 rounded-xl border border-gray-200 bg-white shadow-card">
          {/* Header - hidden on mobile (shown in MobileHeader instead) */}
          <div className="flex flex-col min-h-0 flex-1 p-4 md:p-6">
          <div className="mb-4 hidden md:flex items-center justify-between gap-3">
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
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-footnote text-gray-800 focus:outline-none focus:ring-2 focus:ring-blurple"
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
              {!showVideoPlan && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowVideoPlan(true)}
                  aria-label="Show video plan"
                >
                  <Icon icon={ImageIcon} size="sm" />
                </Button>
              )}
            </div>
          </div>

          {/* Mobile header - shown on mobile */}
          <div className="mb-4 flex md:hidden items-center justify-between gap-3">
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
              {!showVideoPlan && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowVideoPlan(true)}
                  aria-label="Show video plan"
                >
                  <Icon icon={ImageIcon} size="sm" />
                </Button>
              )}
            </div>
          </div>

          {/* Chat messages container with integrated input */}
          <div className="flex flex-1 flex-col min-h-0 overflow-hidden -mx-4 md:-mx-6">
            {/* Messages area - scrollable */}
            <div className="flex-1 overflow-y-auto py-4 min-h-0">
              {messages.map((message) => (
                <ChatBubble
                  key={message.id}
                  variant={message.from === 'parent' ? 'parent' : 'ai'}
                  message={message.text}
                  timestamp={message.timestamp}
                  avatarUrl={
                    message.from === 'assistant'
                      ? '/images/kindnet-logo.png'
                      : undefined
                  }
                />
              ))}
              {/* Invisible element at the end for auto-scroll */}
              <div ref={messagesEndRef} />
            </div>

            {/* Input area - integrated at bottom of chat screen */}
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
              <div className="mt-0 flex items-center justify-end md:hidden">
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    aria-label="New chat"
                  >
                    <Icon icon={PlusIcon} size="sm" />
                    <span>New</span>
                  </Button>
                  {!showPreviousChats && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPreviousChats(true)}
                      aria-label="View old chats"
                    >
                      <Icon icon={MenuIcon} size="sm" />
                      <span>Previous</span>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>

        {/* Video plan sidebar - toggleable, responsive */}
        {showVideoPlan && (
          <>
            {/* Backdrop overlay for mobile */}
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setShowVideoPlan(false)}
            />
            <aside className="hidden lg:flex w-80 bg-white flex-col rounded-xl shadow-card flex-shrink-0 border border-gray-200">
              <div className="h-full flex flex-col p-4 md:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-subhead font-semibold text-gray-900">
                    Sora video plan
                  </h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {latestVideoPlan ? 'mocked' : 'off'}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowVideoPlan(false)}
                      aria-label="Close video plan"
                    >
                      <Icon icon={ChevronRightIcon} size="sm" />
                    </Button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {latestVideoPlan ? (
                    <>
                      <p className="text-footnote text-gray-700 leading-relaxed">
                        Ready to send to OpenAI Sora once connected. Currently
                        returning a mock prompt only.
                      </p>
                      <div className="mt-3 space-y-2 text-footnote text-gray-800">
                        <div>
                          <div className="text-caption uppercase tracking-wide text-gray-500">
                            Title
                          </div>
                          <div className="font-semibold">{latestVideoPlan.title}</div>
                        </div>
                        <div>
                          <div className="text-caption uppercase tracking-wide text-gray-500">
                            Prompt
                          </div>
                          <div className="text-gray-800">{latestVideoPlan.prompt}</div>
                        </div>
                        {latestVideoPlan.note && (
                          <div className="text-caption text-gray-500">
                            {latestVideoPlan.note}
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <p className="text-footnote text-gray-700 leading-relaxed">
                      Ask for a video (e.g., "Can you draft a Sora video for this?")
                      and we will prep a prompt here.
                    </p>
                  )}
                </div>
              </div>
            </aside>
            {/* Mobile video plan sidebar - overlay */}
            <aside className="fixed right-0 top-0 bottom-0 w-full lg:hidden bg-white rounded-l-3xl border-l border-gray-200 shadow-card z-50 flex flex-col">
              <div className="h-full flex flex-col p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-subhead font-semibold text-gray-900">
                    Sora video plan
                  </h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {latestVideoPlan ? 'mocked' : 'off'}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowVideoPlan(false)}
                      aria-label="Close video plan"
                    >
                      <Icon icon={XIcon} size="sm" />
                    </Button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {latestVideoPlan ? (
                    <>
                      <p className="text-footnote text-gray-700 leading-relaxed">
                        Ready to send to OpenAI Sora once connected. Currently
                        returning a mock prompt only.
                      </p>
                      <div className="mt-3 space-y-2 text-footnote text-gray-800">
                        <div>
                          <div className="text-caption uppercase tracking-wide text-gray-500">
                            Title
                          </div>
                          <div className="font-semibold">{latestVideoPlan.title}</div>
                        </div>
                        <div>
                          <div className="text-caption uppercase tracking-wide text-gray-500">
                            Prompt
                          </div>
                          <div className="text-gray-800">{latestVideoPlan.prompt}</div>
                        </div>
                        {latestVideoPlan.note && (
                          <div className="text-caption text-gray-500">
                            {latestVideoPlan.note}
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <p className="text-footnote text-gray-700 leading-relaxed">
                      Ask for a video (e.g., "Can you draft a Sora video for this?")
                      and we will prep a prompt here.
                    </p>
                  )}
                </div>
              </div>
            </aside>
          </>
        )}
      </div>
    </div>
  )
}
