import * as React from "react"
import { cn } from "@/lib/utils"

interface ChatBubbleProps {
  message: string
  timestamp?: string
  variant: "ai" | "parent"
  avatarUrl?: string
  className?: string
}

const ChatBubble = React.forwardRef<HTMLDivElement, ChatBubbleProps>(
  ({ message, timestamp, variant, avatarUrl, className }, ref) => {
    if (variant === "ai") {
      return (
        <div
          ref={ref}
          className={cn("flex gap-3 sm:gap-3.5 mb-6 items-start px-4 sm:px-6", className)}
        >
          {/* Avatar */}
          {avatarUrl && (
            <img
              src={avatarUrl}
              alt="KindNet AI"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0 mt-0.5"
              style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
            />
          )}

          {/* Bubble with AI message styling */}
          <div className="flex flex-col items-start max-w-[80%] sm:max-w-[75%]">
            <div
              className="bg-gray-100 px-4 sm:px-5 py-3 sm:py-3.5"
              style={{
                borderRadius: '20px',
                borderTopLeftRadius: '4px', // Sharp corner closest to avatar
              }}
            >
              <p className="text-[17px] leading-[1.47] tracking-[-0.41px] text-gray-800 whitespace-pre-line">
                {message}
              </p>
            </div>

            {/* Timestamp */}
            {timestamp && (
              <span className="text-[13px] leading-[1.38] tracking-[-0.08px] text-gray-500 mt-2 ml-4">
                {timestamp}
              </span>
            )}
          </div>
        </div>
      )
    }

    // Parent message (right-aligned)
    return (
      <div
        ref={ref}
        className={cn("flex justify-end mb-6 px-4 sm:px-6", className)}
      >
        <div className="flex flex-col items-end max-w-[80%] sm:max-w-[75%]">
          {/* Bubble with parent message styling */}
          <div
            className="bg-blurple px-4 sm:px-5 py-3 sm:py-3.5"
            style={{
              borderRadius: '20px',
              borderTopRightRadius: '4px', // Sharp corner on right
            }}
          >
            <p className="text-[17px] leading-[1.47] tracking-[-0.41px] text-white whitespace-pre-line">
              {message}
            </p>
          </div>

          {/* Timestamp */}
          {timestamp && (
            <span className="text-[13px] leading-[1.38] tracking-[-0.08px] text-gray-500 mt-2 mr-4">
              {timestamp}
            </span>
          )}
        </div>
      </div>
    )
  }
)
ChatBubble.displayName = "ChatBubble"

export { ChatBubble }
export type { ChatBubbleProps }
