'use client'

import ParentChatPanel from './ParentChatPanel'

interface ParentDashboardProps {
  parentId: string
}

export default function ParentDashboard({ parentId }: ParentDashboardProps) {
  return (
    <div className="h-[calc(100vh-80px)] overflow-hidden">
      <ParentChatPanel />
    </div>
  )
}

