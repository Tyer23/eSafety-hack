import { TrendingUp, TrendingDown, Minus, Send, X, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function TestPage() {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div>
          <h1 className="text-title-1 text-gray-800 mb-2">
            KindNet Design System Test
          </h1>
          <p className="text-body text-gray-600">
            Testing all design tokens, typography, and utilities
          </p>
        </div>

        {/* Colors Section */}
        <section className="space-y-4">
          <h2 className="text-title-2 text-gray-800">Brand Colors</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="h-20 rounded-xl bg-blurple flex items-center justify-center text-white font-medium">
                Blurple
              </div>
              <p className="text-footnote text-gray-500">#6B7FFF</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 rounded-xl bg-safe flex items-center justify-center text-white font-medium">
                Safe Green
              </div>
              <p className="text-footnote text-gray-500">#7ED957</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 rounded-xl bg-alert flex items-center justify-center text-white font-medium">
                Alert Red
              </div>
              <p className="text-footnote text-gray-500">#FF6B6B</p>
            </div>
          </div>
        </section>

        {/* Gray Scale */}
        <section className="space-y-4">
          <h2 className="text-title-2 text-gray-800">Neutral Colors (iOS 18)</h2>
          <div className="grid grid-cols-5 gap-2">
            {[50, 100, 200, 500, 800].map((shade) => (
              <div key={shade} className="space-y-2">
                <div
                  className={cn(
                    "h-16 rounded-lg flex items-center justify-center text-xs font-medium",
                    shade <= 200 ? "text-gray-800" : "text-white",
                    `bg-gray-${shade}`
                  )}
                >
                  {shade}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Typography */}
        <section className="space-y-4">
          <h2 className="text-title-2 text-gray-800">Typography (iOS Scale)</h2>
          <div className="space-y-3 p-6 bg-gray-50 rounded-xl">
            <h1 className="text-large-title text-gray-800">Large Title (34px)</h1>
            <h2 className="text-title-1 text-gray-800">Title 1 (28px)</h2>
            <h3 className="text-title-2 text-gray-800">Title 2 (22px)</h3>
            <h4 className="text-title-3 text-gray-800">Title 3 (20px)</h4>
            <p className="text-body text-gray-800">Body (17px) - iOS default size with -0.41px tracking</p>
            <p className="text-callout text-gray-600">Callout (16px)</p>
            <p className="text-subhead text-gray-600">Subhead (15px)</p>
            <p className="text-footnote text-gray-500">Footnote (13px) - For timestamps</p>
            <p className="text-caption text-gray-500">Caption (12px) - Fine print</p>
          </div>
        </section>

        {/* Lucide Icons */}
        <section className="space-y-4">
          <h2 className="text-title-2 text-gray-800">Lucide Icons</h2>
          <div className="flex items-center gap-8 p-6 bg-gray-50 rounded-xl">
            <div className="text-center space-y-2">
              <TrendingUp className="w-8 h-8 text-safe mx-auto" strokeWidth={2.5} />
              <p className="text-footnote text-gray-500">Positive</p>
            </div>
            <div className="text-center space-y-2">
              <Minus className="w-8 h-8 text-gray-500 mx-auto" strokeWidth={2.5} />
              <p className="text-footnote text-gray-500">Neutral</p>
            </div>
            <div className="text-center space-y-2">
              <TrendingDown className="w-8 h-8 text-alert mx-auto" strokeWidth={2.5} />
              <p className="text-footnote text-gray-500">Negative</p>
            </div>
            <div className="text-center space-y-2">
              <Send className="w-6 h-6 text-blurple mx-auto" />
              <p className="text-footnote text-gray-500">Send</p>
            </div>
            <div className="text-center space-y-2">
              <X className="w-6 h-6 text-gray-600 mx-auto" />
              <p className="text-footnote text-gray-500">Close</p>
            </div>
            <div className="text-center space-y-2">
              <ChevronRight className="w-6 h-6 text-gray-600 mx-auto" />
              <p className="text-footnote text-gray-500">Chevron</p>
            </div>
          </div>
        </section>

        {/* Shadows */}
        <section className="space-y-4">
          <h2 className="text-title-2 text-gray-800">Shadows (iOS 18 - Very Subtle)</h2>
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-soft text-center">
              <p className="text-subhead text-gray-800 font-medium mb-1">Soft</p>
              <p className="text-footnote text-gray-500">0 1px 4px</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-card text-center">
              <p className="text-subhead text-gray-800 font-medium mb-1">Card</p>
              <p className="text-footnote text-gray-500">0 2px 8px</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-elevated text-center">
              <p className="text-subhead text-gray-800 font-medium mb-1">Elevated</p>
              <p className="text-footnote text-gray-500">0 4px 16px</p>
            </div>
          </div>
        </section>

        {/* Spacing */}
        <section className="space-y-4">
          <h2 className="text-title-2 text-gray-800">Spacing System (4px base)</h2>
          <div className="space-y-2 p-6 bg-gray-50 rounded-xl">
            {[1, 2, 3, 4, 6, 8].map((space) => (
              <div key={space} className="flex items-center gap-4">
                <span className="text-footnote text-gray-500 w-12">space-{space}</span>
                <div className={`h-4 bg-blurple rounded`} style={{ width: `${space * 4}px` }} />
                <span className="text-footnote text-gray-400">{space * 4}px</span>
              </div>
            ))}
          </div>
        </section>

        {/* Border Radius */}
        <section className="space-y-4">
          <h2 className="text-title-2 text-gray-800">Border Radius</h2>
          <div className="grid grid-cols-4 gap-4">
            {['sm', 'md', 'lg', 'xl'].map((size) => (
              <div key={size} className="text-center space-y-2">
                <div className={`h-20 bg-blurple/10 border-2 border-blurple rounded-${size}`} />
                <p className="text-footnote text-gray-500">rounded-{size}</p>
              </div>
            ))}
          </div>
        </section>

        {/* cn() Utility Test */}
        <section className="space-y-4">
          <h2 className="text-title-2 text-gray-800">cn() Utility Function</h2>
          <div className="p-6 bg-gray-50 rounded-xl space-y-4">
            <div className={cn(
              "p-4 rounded-lg",
              "bg-blurple text-white",
              "hover:bg-blurple/90",
              "transition-all"
            )}>
              <p className="text-body">Classes merged with cn() utility</p>
              <p className="text-footnote opacity-80">Hover to see effect</p>
            </div>

            <div className={cn(
              "p-4 rounded-lg border-2",
              true && "border-safe bg-safe/10",  // Conditional
              "text-safe font-medium"
            )}>
              <p className="text-subhead">Conditional classes work!</p>
            </div>
          </div>
        </section>

        {/* Chat Bubble Preview (iOS iMessage Style) */}
        <section className="space-y-4">
          <h2 className="text-title-2 text-gray-800">Chat Bubble Preview (Figma Design)</h2>

          {/* AI Message */}
          <div className="flex gap-3 items-start">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blurple to-blurple-dark flex items-center justify-center text-white font-bold">
              AI
            </div>
            <div className="flex flex-col items-start max-w-[75%]">
              <div
                className="bg-gray-100 px-5 py-3.5"
                style={{
                  borderRadius: '20px',
                  borderTopLeftRadius: '4px',
                }}
              >
                <p className="text-[17px] leading-[1.47] tracking-[-0.41px] text-gray-800">
                  This is an AI message with the iOS iMessage-style design from Figma.
                  Notice the one sharp corner (4px) closest to the avatar.
                </p>
              </div>
              <span className="text-[13px] leading-[1.38] tracking-[-0.08px] text-gray-500 mt-2 ml-4">
                2:34 PM
              </span>
            </div>
          </div>

          {/* Parent Message */}
          <div className="flex justify-end">
            <div className="flex flex-col items-end max-w-[75%]">
              <div
                className="bg-blurple px-5 py-3.5"
                style={{
                  borderRadius: '20px',
                  borderTopRightRadius: '4px',
                }}
              >
                <p className="text-[17px] leading-[1.47] tracking-[-0.41px] text-white">
                  Perfect! The parent message bubble with sharp corner on the right.
                </p>
              </div>
              <span className="text-[13px] leading-[1.38] tracking-[-0.08px] text-gray-500 mt-2 mr-4">
                2:35 PM
              </span>
            </div>
          </div>
        </section>

        {/* Metric Badge Preview */}
        <section className="space-y-4">
          <h2 className="text-title-2 text-gray-800">Metric Badge Preview (Figma Design)</h2>
          <div className="flex justify-between items-start p-8 bg-white border border-gray-200 rounded-3xl shadow-card">
            {/* Positive */}
            <div className="flex flex-col items-center gap-3 flex-1">
              <div
                className="w-16 h-16 rounded-full bg-safe flex items-center justify-center"
                style={{ boxShadow: '0 2px 8px rgba(126, 217, 87, 0.25)' }}
              >
                <TrendingUp className="w-8 h-8 text-white" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <div className="text-[32px] leading-none text-gray-800 font-semibold">68</div>
                <div className="text-[13px] leading-none text-gray-500 mt-1">Positive</div>
                <div className="text-[13px] leading-none text-safe font-semibold mt-1">↑ +13</div>
              </div>
            </div>

            {/* Neutral */}
            <div className="flex flex-col items-center gap-3 flex-1">
              <div
                className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center"
                style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)' }}
              >
                <Minus className="w-8 h-8 text-gray-600" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <div className="text-[32px] leading-none text-gray-800 font-semibold">40</div>
                <div className="text-[13px] leading-none text-gray-500 mt-1">Neutral</div>
              </div>
            </div>

            {/* Negative */}
            <div className="flex flex-col items-center gap-3 flex-1">
              <div
                className="w-16 h-16 rounded-full bg-error-bg flex items-center justify-center"
                style={{ boxShadow: '0 2px 8px rgba(255, 107, 107, 0.2)' }}
              >
                <TrendingDown className="w-8 h-8 text-alert" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <div className="text-[32px] leading-none text-gray-800 font-semibold">12</div>
                <div className="text-[13px] leading-none text-gray-500 mt-1">Negative</div>
                <div className="text-[13px] leading-none text-alert font-semibold mt-1">↓ -6</div>
              </div>
            </div>
          </div>
        </section>

        {/* Success Message */}
        <div className="p-6 bg-success-bg border border-success rounded-xl">
          <p className="text-body text-success font-medium mb-1">✓ Design System Ready!</p>
          <p className="text-subhead text-gray-700">
            All design tokens, utilities, and Lucide icons are working correctly.
            Ready to build the component library.
          </p>
        </div>
      </div>
    </div>
  )
}
