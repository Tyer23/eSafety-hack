import { Send, Heart, X, TrendingUp } from 'lucide-react'
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
  Input,
  ChatBubble,
} from '@/components/ui'

export default function ComponentsDemo() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div>
          <h1 className="text-title-1 text-gray-800 mb-2">Component Library</h1>
          <p className="text-body text-gray-600">
            All components built with Radix UI + CVA + Lucide icons
          </p>
        </div>

        {/* Buttons Section */}
        <section className="space-y-4">
          <h2 className="text-title-2 text-gray-800">Buttons</h2>
          <Card>
            <CardHeader>
              <CardTitle>Button Variants</CardTitle>
              <CardDescription>
                Type-safe variants using Class Variance Authority (CVA)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Variants */}
              <div>
                <p className="text-subhead text-gray-700 mb-3 font-medium">Variants</p>
                <div className="flex flex-wrap gap-3">
                  <Button variant="default">Default</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="link">Link</Button>
                </div>
              </div>

              {/* Sizes */}
              <div>
                <p className="text-subhead text-gray-700 mb-3 font-medium">Sizes</p>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="sm">Small</Button>
                  <Button size="default">Default</Button>
                  <Button size="lg">Large</Button>
                  <Button size="icon">
                    <Heart className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* With Icons */}
              <div>
                <p className="text-subhead text-gray-700 mb-3 font-medium">With Lucide Icons</p>
                <div className="flex flex-wrap gap-3">
                  <Button>
                    <Send className="w-4 h-4" />
                    Send Message
                  </Button>
                  <Button variant="secondary">
                    <TrendingUp className="w-4 h-4" />
                    View Stats
                  </Button>
                  <Button variant="outline">
                    <X className="w-4 h-4" />
                    Close
                  </Button>
                </div>
              </div>

              {/* States */}
              <div>
                <p className="text-subhead text-gray-700 mb-3 font-medium">States</p>
                <div className="flex flex-wrap gap-3">
                  <Button disabled>Disabled</Button>
                  <Button variant="secondary" disabled>
                    Disabled Secondary
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Badges Section */}
        <section className="space-y-4">
          <h2 className="text-title-2 text-gray-800">Badges</h2>
          <Card>
            <CardHeader>
              <CardTitle>Badge Variants</CardTitle>
              <CardDescription>Status indicators and labels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Badge variant="default">Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="outline">Outline</Badge>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Inputs Section */}
        <section className="space-y-4">
          <h2 className="text-title-2 text-gray-800">Inputs</h2>
          <Card>
            <CardHeader>
              <CardTitle>Input Fields</CardTitle>
              <CardDescription>Form inputs with proper focus states</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="Enter your name..." />
              <Input type="email" placeholder="Enter your email..." />
              <Input disabled placeholder="Disabled input" />
            </CardContent>
          </Card>
        </section>

        {/* Chat Bubbles Section */}
        <section className="space-y-4">
          <h2 className="text-title-2 text-gray-800">Chat Bubbles (iOS iMessage Style)</h2>
          <Card>
            <CardHeader>
              <CardTitle>Chat Bubble Component</CardTitle>
              <CardDescription>
                From Figma design - 20px border radius with one 4px sharp corner
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* AI Messages */}
              <div>
                <p className="text-subhead text-gray-700 mb-4 font-medium">AI Messages (Left-aligned)</p>
                <div className="bg-white rounded-xl p-4">
                  <ChatBubble
                    variant="ai"
                    message="Hi! I can help you understand your child's online patterns in plain language."
                    timestamp="2:34 PM"
                    avatarUrl="https://api.dicebear.com/7.x/bottts/svg?seed=kindnet"
                  />
                  <ChatBubble
                    variant="ai"
                    message="This week shows a positive trend! Maya's messaging overall was friendly and supportive."
                    timestamp="2:36 PM"
                    avatarUrl="https://api.dicebear.com/7.x/bottts/svg?seed=kindnet"
                  />
                </div>
              </div>

              {/* Parent Messages */}
              <div>
                <p className="text-subhead text-gray-700 mb-4 font-medium">Parent Messages (Right-aligned)</p>
                <div className="bg-white rounded-xl p-4">
                  <ChatBubble
                    variant="parent"
                    message="That's great to hear! Were there any challenging moments?"
                    timestamp="2:35 PM"
                  />
                  <ChatBubble
                    variant="parent"
                    message="Thanks! This is really helpful."
                    timestamp="2:38 PM"
                  />
                </div>
              </div>

              {/* Conversation Example */}
              <div>
                <p className="text-subhead text-gray-700 mb-4 font-medium">Full Conversation</p>
                <div className="bg-white rounded-xl p-4">
                  <ChatBubble
                    variant="ai"
                    message="Hi! How can I help you today?"
                    timestamp="2:30 PM"
                    avatarUrl="https://api.dicebear.com/7.x/bottts/svg?seed=kindnet"
                  />
                  <ChatBubble
                    variant="parent"
                    message="I'd like to know how Jamie is doing online this week."
                    timestamp="2:31 PM"
                  />
                  <ChatBubble
                    variant="ai"
                    message="Jamie is developing strong digital habits! This week, he responded kindly in 8 out of 9 peer interactions."
                    timestamp="2:32 PM"
                    avatarUrl="https://api.dicebear.com/7.x/bottts/svg?seed=kindnet"
                  />
                  <ChatBubble
                    variant="parent"
                    message="That's wonderful! Thank you."
                    timestamp="2:33 PM"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Cards Section */}
        <section className="space-y-4">
          <h2 className="text-title-2 text-gray-800">Cards</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Simple Card</CardTitle>
                <CardDescription>A basic card with header and content</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-body text-gray-600">
                  This is the card content area. It can contain any content you need.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Card with Footer</CardTitle>
                <CardDescription>Includes footer with actions</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-body text-gray-600">
                  Cards can have footers for actions or additional information.
                </p>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button size="sm">Accept</Button>
                <Button size="sm" variant="outline">
                  Decline
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Success Message */}
        <div className="p-6 bg-success-bg border border-success rounded-xl">
          <p className="text-body text-success font-medium mb-1">
            ✓ Component Library Complete!
          </p>
          <p className="text-subhead text-gray-700">
            All 5 core components are built and ready to use:
          </p>
          <ul className="text-subhead text-gray-700 mt-2 space-y-1 ml-4">
            <li>• Button (with CVA variants)</li>
            <li>• Card (with subcomponents)</li>
            <li>• Badge (status indicators)</li>
            <li>• Input (with focus states)</li>
            <li>• ChatBubble (iOS iMessage style from Figma)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
