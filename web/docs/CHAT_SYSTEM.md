# Chat System Documentation

## Overview

The KindNet chat system provides a persistent, session-based chat interface for parents to interact with the AI assistant. All chat conversations are stored locally (using browser localStorage) and can be resumed at any time.

## Architecture

### Components

1. **Chat Storage (`web/lib/chatStorage.ts`)**
   - Manages persistent storage of chat sessions
   - Uses localStorage for MVP (can be upgraded to backend API)
   - Handles session creation, updates, and retrieval

2. **Chat Panel (`web/components/ParentChatPanel.tsx`)**
   - Main UI component for the chat interface
   - Manages chat state, message sending, and session loading
   - Integrates with the AI agent via `/api/chat`

3. **Chat API (`web/app/api/chat/route.ts`)**
   - Handles chat requests from the frontend
   - Integrates with OpenAI GPT-4o-mini (if API key available)
   - Falls back to local agent if OpenAI is unavailable
   - Accepts optional `sessionId` for conversation continuity

## Data Flow

### Creating a New Chat

1. User types a message and clicks "Send" or presses Enter
2. If no current session exists:
   - A new chat session is created with a unique ID
   - Title is auto-generated from the first message (first 50 characters)
   - Session is saved to localStorage
3. Parent message is added to the session
4. Request is sent to `/api/chat` with:
   - `message`: The parent's text
   - `childId`: Selected child's ID
   - `sessionId`: Current session ID (if exists)
5. AI agent processes the request and returns a reply
6. Assistant reply is added to the session
7. Session is updated in localStorage with new messages

### Continuing a Previous Chat

1. User clicks on a previous chat in the sidebar
2. `handleLoadChat(sessionId)` is called
3. Session is loaded from localStorage
4. Messages are displayed in the chat panel
5. `currentSessionId` is set to the loaded session
6. When user sends a new message:
   - Message is added to the existing session (not a new one)
   - Session is updated with new messages
   - `lastMessage` and `updatedAt` are updated

### Chat Session Structure

```typescript
interface ChatSession {
  id: string                    // Unique session ID (e.g., "chat_1234567890_abc123")
  title: string                 // Auto-generated from first message
  messages: ChatMessage[]       // Array of all messages in the conversation
  lastMessage: string           // Last message text (for preview in sidebar)
  createdAt: string            // ISO timestamp of session creation
  updatedAt: string            // ISO timestamp of last update
  childId?: string             // Associated child ID (optional)
}

interface ChatMessage {
  id: number                   // Sequential message ID within session
  from: 'parent' | 'assistant' // Message sender
  text: string                 // Message content
  timestamp?: string          // ISO timestamp
  highlights?: {              // AI-generated insights (optional)
    weeklySummary: string
    focusTheme: string
    positiveProgress: string[]
    gentleFlags: string[]
  }
}
```

## Storage

### localStorage Structure

- **Key Format**: `kindnet_chats_{parentId}`
  - Example: `kindnet_chats_parent_01`
- **Value**: JSON array of `ChatSession` objects
- **Sorting**: Sessions are sorted by `updatedAt` (most recent first)

### Storage Operations

1. **Load Sessions**: `loadChatSessions(parentId)`
   - Reads from localStorage
   - Returns sorted array (newest first)
   - Returns empty array if no sessions exist

2. **Save Session**: `saveChatSession(parentId, session)`
   - Creates new session or updates existing one
   - Automatically sets `updatedAt` timestamp
   - Saves to localStorage

3. **Create New**: `createNewChatSession(parentId, firstMessage, childId?)`
   - Generates unique session ID
   - Auto-generates title from first message
   - Creates initial session with first message

4. **Add Message**: `addMessageToSession(parentId, sessionId, message)`
   - Adds message to existing session
   - Updates `lastMessage` and `updatedAt`
   - Updates title if this is the first parent message

5. **Get Session**: `getChatSession(parentId, sessionId)`
   - Retrieves specific session by ID
   - Returns `null` if not found

6. **Delete Session**: `deleteChatSession(parentId, sessionId)`
   - Removes session from storage
   - Returns `true` on success

## UI Features

### Previous Chats Sidebar

- **Display**: Shows all chat sessions sorted by most recent
- **Preview**: Each chat shows:
  - Title (auto-generated from first message)
  - Last message preview (truncated)
- **Active State**: Current chat is highlighted with blurple border
- **Click Action**: Clicking a chat loads it into the main panel
- **Empty State**: Shows "No previous chats yet" if no sessions exist

### New Chat Button

- **Action**: Creates a fresh chat session
- **Behavior**:
  - Clears current session ID
  - Resets messages to initial welcome message
  - Clears video plan
  - Next message will create a new session

### Chat Input

- **Auto-resize**: Textarea grows with content (max 120px)
- **Send Button**: Inside textarea, right-aligned
- **Keyboard**: Enter to send, Shift+Enter for new line

## API Integration

### `/api/chat` Endpoint

**Request:**
```json
{
  "message": "How is Jamie doing this week?",
  "childId": "kid_01",
  "sessionId": "chat_1234567890_abc123"  // Optional
}
```

**Response:**
```json
{
  "childId": "kid_01",
  "reply": "Jamie has shown great progress this week...",
  "highlights": {
    "weeklySummary": "...",
    "focusTheme": "Kindness",
    "positiveProgress": ["..."],
    "gentleFlags": ["..."]
  },
  "videoPlan": {  // Optional, only if video requested
    "title": "...",
    "prompt": "...",
    "status": "mocked"
  }
}
```

## Future Enhancements

1. **Backend Storage**: Migrate from localStorage to backend API
   - Store chats in database
   - Enable cross-device access
   - Add user authentication

2. **Chat Search**: Search through previous chats by content

3. **Chat Export**: Allow parents to export chat history

4. **Chat Sharing**: Share specific conversations (with privacy controls)

5. **Context Awareness**: AI agent could use previous chat history for better context

6. **Chat Analytics**: Track common questions, topics, etc.

## Technical Notes

- **localStorage Limits**: Browser localStorage typically has 5-10MB limit
- **Data Persistence**: Data persists across browser sessions
- **Privacy**: All data is stored locally in the browser (MVP)
- **Session IDs**: Format: `chat_{timestamp}_{random}` ensures uniqueness
- **Title Generation**: First 50 characters of first parent message, truncated with "..." if longer

## Error Handling

- If localStorage is unavailable or full, errors are logged to console
- Chat functionality continues to work (messages just won't persist)
- API errors fall back to local agent to ensure UI never breaks

