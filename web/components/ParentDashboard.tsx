'use client'

import ParentChatPanel from './ParentChatPanel'

interface ParentDashboardProps {
  parentId: string
}

export default function ParentDashboard({ parentId }: ParentDashboardProps) {
  return (
    <div className="h-[calc(100vh-120px)] -mx-4 -my-6 overflow-hidden">
      <ParentChatPanel />
    </div>
  )
}
