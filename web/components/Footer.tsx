'use client'

import { Badge } from '@/components/ui/badge'

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white py-6">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        <div className="flex flex-col items-center gap-3 text-center">
          <Badge variant="default" className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
            MVP Prototype · Local-Only Demo
          </Badge>
          <p className="text-footnote text-gray-600">
            KindNet © 2025 · Empowering Safe Digital Exploration
          </p>
        </div>
      </div>
    </footer>
  )
}
