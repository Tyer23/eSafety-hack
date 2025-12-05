/**
 * Chat Storage Utility
 * 
 * Manages persistent storage of chat sessions for parents.
 * Uses localStorage for MVP (can be upgraded to backend API later).
 */

export interface ChatMessage {
  id: number
  from: 'parent' | 'assistant'
  text: string
  timestamp?: string
  highlights?: {
    weeklySummary: string
    focusTheme: string
    positiveProgress: string[]
    gentleFlags: string[]
  }
}

export interface ChatSession {
  id: string
  title: string
  messages: ChatMessage[]
  lastMessage: string
  createdAt: string
  updatedAt: string
  childId?: string
}

const STORAGE_KEY_PREFIX = 'kindnet_chats_'

/**
 * Get storage key for a specific parent
 */
function getStorageKey(parentId: string): string {
  return `${STORAGE_KEY_PREFIX}${parentId}`
}

/**
 * Generate a unique chat session ID
 */
function generateSessionId(): string {
  return `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Generate a title from the first parent message
 */
function generateTitle(firstMessage: string): string {
  // Take first 50 characters and clean up
  const cleaned = firstMessage.trim().slice(0, 50)
  if (cleaned.length < firstMessage.length) {
    return cleaned + '...'
  }
  return cleaned
}

/**
 * Load all chat sessions for a parent
 */
export function loadChatSessions(parentId: string): ChatSession[] {
  // Only access localStorage on the client side
  if (typeof window === 'undefined') {
    return []
  }
  
  try {
    const key = getStorageKey(parentId)
    const stored = localStorage.getItem(key)
    if (!stored) return []
    
    const sessions = JSON.parse(stored) as ChatSession[]
    // Sort by updatedAt (most recent first)
    return sessions.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
  } catch (error) {
    console.error('Error loading chat sessions:', error)
    return []
  }
}

/**
 * Save a chat session (create new or update existing)
 */
export function saveChatSession(
  parentId: string,
  session: Omit<ChatSession, 'createdAt' | 'updatedAt'> & { createdAt?: string; updatedAt?: string }
): ChatSession {
  // Only access localStorage on the client side
  if (typeof window === 'undefined') {
    return session as ChatSession
  }
  
  const sessions = loadChatSessions(parentId)
  const now = new Date().toISOString()
  
  const fullSession: ChatSession = {
    ...session,
    createdAt: session.createdAt || now,
    updatedAt: now,
  }
  
  // Check if session already exists
  const existingIndex = sessions.findIndex(s => s.id === fullSession.id)
  
  if (existingIndex >= 0) {
    // Update existing session
    sessions[existingIndex] = fullSession
  } else {
    // Add new session
    sessions.push(fullSession)
  }
  
  // Save to localStorage
  try {
    const key = getStorageKey(parentId)
    localStorage.setItem(key, JSON.stringify(sessions))
  } catch (error) {
    console.error('Error saving chat session:', error)
  }
  
  return fullSession
}

/**
 * Create a new chat session from the first message
 */
export function createNewChatSession(
  parentId: string,
  firstMessage: ChatMessage,
  childId?: string
): ChatSession {
  const sessionId = generateSessionId()
  const title = generateTitle(firstMessage.text)
  
  const session: ChatSession = {
    id: sessionId,
    title,
    messages: [firstMessage],
    lastMessage: firstMessage.text,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    childId,
  }
  
  return saveChatSession(parentId, session)
}

/**
 * Add a message to an existing chat session
 */
export function addMessageToSession(
  parentId: string,
  sessionId: string,
  message: ChatMessage
): ChatSession | null {
  const sessions = loadChatSessions(parentId)
  const session = sessions.find(s => s.id === sessionId)
  
  if (!session) {
    console.error(`Session ${sessionId} not found`)
    return null
  }
  
  // Add message and update lastMessage
  session.messages.push(message)
  session.lastMessage = message.text
  session.updatedAt = new Date().toISOString()
  
  // If this is the first parent message and title is still generic, update title
  if (message.from === 'parent' && session.messages.filter(m => m.from === 'parent').length === 1) {
    session.title = generateTitle(message.text)
  }
  
  return saveChatSession(parentId, session)
}

/**
 * Get a specific chat session by ID
 */
export function getChatSession(parentId: string, sessionId: string): ChatSession | null {
  // Only access localStorage on the client side
  if (typeof window === 'undefined') {
    return null
  }
  
  const sessions = loadChatSessions(parentId)
  return sessions.find(s => s.id === sessionId) || null
}

/**
 * Delete a chat session
 */
export function deleteChatSession(parentId: string, sessionId: string): boolean {
  // Only access localStorage on the client side
  if (typeof window === 'undefined') {
    return false
  }
  
  try {
    const sessions = loadChatSessions(parentId)
    const filtered = sessions.filter(s => s.id !== sessionId)
    
    const key = getStorageKey(parentId)
    localStorage.setItem(key, JSON.stringify(filtered))
    return true
  } catch (error) {
    console.error('Error deleting chat session:', error)
    return false
  }
}

