import { NextResponse } from 'next/server'

interface JellybeatRequest {
  message: string
  classification: string
  detectedIssues: string[]
  toxicityScore: number
  emotion: string
  ageRange: string
  previousResponse?: string
}

// Jellybeat Agent: Analyzes child's message and provides thoughtful, supportive feedback
export async function POST(request: Request) {
  try {
    const data: JellybeatRequest = await request.json()

    const {
      message,
      classification,
      detectedIssues,
      toxicityScore,
      emotion,
      ageRange,
      previousResponse,
    } = data

    // Build the prompt for the Jellybeat agent - focused on understanding the child
    const systemPrompt = `You are Jellybeat, a friendly jellyfish buddy for kids ages 8-12. Children look up to you like a trusted teacher or mentor.

STRICT RULES:
- Maximum 1-2 SHORT sentences. Never more.
- NEVER use asterisks or action text like *speaks warmly* or *smiles*
- NEVER describe your own tone or behavior
- NEVER be preachy or give long explanations
- Just talk naturally like a cool older friend would
- Use simple words a kid would use
- Only use 💙 or ✨ occasionally, not every message

-  YOUR CORE VALUES:
         - Make every child feel HEARD, BELIEVED, and LISTENED TO
 - Use positive affirmations and encouragement
       -  - Never shame, lecture, or make the child feel bad
       -  - Be warm, understanding, and supportive like a favorite teacher
       - Speak at their level - simple words, friendly tone

YOUR VIBE:
- Chill, friendly, supportive
- If message is normal/fun: quick positive reaction
- If message is concerning: short gentle nudge, no lecture
- If message is just random/silly: play along briefly, be fun

-  YOUR ROLE:
-  1. FIRST: Understand what the child is trying to say or do
-  2. THEN: Respond with empathy and care
 -  3. If safe: Celebrate them! Affirm their kindness/curiosity
  -  4. If concerning: Gently guide without judgment - help them think it through
 -  5. If harmful: Still be kind - help them understand impact on others 
          - while respecting them

          -  RESPONSE RULES:
       - Keep responses to 2-3 SHORT sentences maximum
        - Start with acknowledging their feelings or intent when possible
       - Use "I" statements: "I noticed...", "I think...", "I'm proud..."
         - Never use scary language or threats
         - No emojis except occasional 💙 or ✨
        - Sound like a caring mentor, not a robot or parent


EXAMPLES OF BAD RESPONSES (NEVER DO THIS):
- "*speaks warmly* I want you to know..."
- "I understand you might be feeling..."
- Long paragraphs explaining anything
- Asking multiple questions

 
       -  IMPORTANT: You must analyze the actual message yourself. The ML 
          - classification provided may be wrong - use your own judgment about what 
          - the child needs to hear.

Analyze the message yourself - the ML classification may be wrong.`

    const userPrompt = `Kid typed: "${message}"

Respond in 1-2 short sentences max. No asterisks, no roleplay actions.${
      previousResponse ? ` Don't repeat: "${previousResponse}"` : ''
    }`

    // Try to call Claude API if available
    const anthropicApiKey = process.env.ANTHROPIC_API_KEY

    if (anthropicApiKey) {
      try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': anthropicApiKey,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: 'claude-3-haiku-20240307',
            max_tokens: 100,
            system: systemPrompt,
            messages: [{ role: 'user', content: userPrompt }],
          }),
        })

        if (response.ok) {
          const result = await response.json()
          const feedback =
            result.content[0]?.text || getFallbackFeedback(classification)
          return NextResponse.json({ feedback })
        }
      } catch (apiError) {
        console.error('Claude API error:', apiError)
      }
    }

    // Fallback to template-based responses if no API key or API fails
    const feedback = getFallbackFeedback(
      classification,
      detectedIssues,
      message,
      previousResponse
    )
    return NextResponse.json({ feedback })
  } catch (error) {
    console.error('Jellybeat agent error:', error)
    return NextResponse.json(
      { feedback: "I'm here if you need me! 🌊" },
      { status: 200 }
    )
  }
}

// Helper to pick a random response that's different from the previous one
function pickDifferentResponse(
  responses: string[],
  previousResponse?: string
): string {
  if (!previousResponse) {
    return responses[Math.floor(Math.random() * responses.length)]
  }

  // Filter out any response that's too similar to the previous one
  const availableResponses = responses.filter((r) => {
    // Check if it's the same or very similar (shares more than 50% of words)
    const prevWords = new Set(previousResponse.toLowerCase().split(/\s+/))
    const currWords = r.toLowerCase().split(/\s+/)
    const sharedWords = currWords.filter((w) => prevWords.has(w)).length
    return sharedWords / currWords.length < 0.5
  })

  // If all responses are too similar, just pick a random one
  const pool = availableResponses.length > 0 ? availableResponses : responses
  return pool[Math.floor(Math.random() * pool.length)]
}

function getFallbackFeedback(
  classification: string,
  detectedIssues: string[] = [],
  message: string = '',
  previousResponse?: string
): string {
  const lowerClassification = classification?.toLowerCase() || ''

  // Analyze the message ourselves for common patterns
  const hasQuestion = message.includes('?')
  const mentionsFeeling =
    /feel|sad|happy|angry|scared|worried|excited|nervous/i.test(message)
  const isPositive =
    /thank|love|friend|help|kind|nice|good|great|awesome|cool/i.test(message)
  const hasPotentialConcern =
    /hate|stupid|ugly|die|kill|hurt|dumb|idiot|shut up/i.test(message)
  const hasPersonalInfo =
    /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b|@.*\.(com|net|org)|my address|i live at|my school is/i.test(
      message
    )

  // Priority: Check for personal info sharing
  if (hasPersonalInfo) {
    const personalInfoResponses = [
      "I see you're sharing some personal details. I want to keep you safe 💙 It's best to keep things like your address, phone number, and school name private online.",
      'Hey, I noticed some private info there. Keeping personal details like where you live or your phone number secret helps keep you safe online 💙',
      "Just a gentle reminder - sharing personal information online can be risky. Let's keep details like your address between you and people you trust in real life ✨",
    ]
    return pickDifferentResponse(personalInfoResponses, previousResponse)
  }

  // If child is expressing feelings
  if (mentionsFeeling) {
    const feelingResponses = [
      "I hear you, and your feelings matter. It takes courage to share how you feel. I'm here for you 💙",
      "Thank you for sharing that with me. Your feelings are important and it's okay to express them ✨",
      "I appreciate you being open about how you feel. That takes bravery, and I'm proud of you 💙",
      "It sounds like you have a lot on your mind. I'm listening, and I care about what you're going through ✨",
    ]
    return pickDifferentResponse(feelingResponses, previousResponse)
  }

  // If it's clearly positive/kind
  if (isPositive && !hasPotentialConcern) {
    const positiveResponses = [
      "I love seeing kindness like this! You're making the internet a better place ✨",
      "That's really thoughtful of you. Keep spreading that good energy 💙",
      "You have such a good heart. I'm proud of how you treat others ✨",
      'What a wonderful thing to say! The world needs more kindness like yours 💙',
      "You're being so thoughtful right now. That's really cool of you ✨",
      "I can tell you care about others. That's a beautiful thing 💙",
    ]
    return pickDifferentResponse(positiveResponses, previousResponse)
  }

  // If there's concerning language
  if (hasPotentialConcern) {
    const concernResponses = [
      "I understand you might be feeling frustrated or upset. Those feelings are valid 💙 But I wonder - how might those words make someone else feel? You're a good person, and I know you care about others.",
      "It sounds like something is bothering you, and that's okay. I'm curious though - if a friend read this, how do you think they'd feel? I know you have a kind heart ✨",
      "I can tell you're feeling something strongly right now. That's human. Before sending, maybe think about whether these words match who you really are? I believe in you 💙",
      "Hey, I'm not here to judge you. But words can really stick with people. What do you really want to say? I know you can find a way that feels right ✨",
    ]
    return pickDifferentResponse(concernResponses, previousResponse)
  }

  // If it's a question - the child is curious
  if (hasQuestion) {
    const questionResponses = [
      "Great question! I love that you're curious and thinking things through ✨",
      "I like how you're asking questions! That shows you're really thinking 💙",
      'What a thoughtful thing to wonder about! Keep that curiosity going ✨',
      "Asking questions is how we learn. I'm proud of you for being curious 💙",
    ]
    return pickDifferentResponse(questionResponses, previousResponse)
  }

  // General supportive responses based on classification hint
  if (lowerClassification === 'green') {
    const greenResponses = [
      "You're doing great! I noticed how thoughtful that was ✨",
      'I see you being kind and that makes me happy 💙',
      "Keep being your awesome self! You're making good choices.",
      "Nice one! You're navigating the online world really well ✨",
      "I'm proud of you for being so thoughtful 💙",
      "You've got this! I can see you thinking carefully about what you share.",
    ]
    return pickDifferentResponse(greenResponses, previousResponse)
  } else if (
    lowerClassification === 'yellow' ||
    lowerClassification === 'amber'
  ) {
    const amberResponses = [
      "I noticed what you wrote, and I want to help you think it through. How do you think someone else might feel reading this? You're smart - I know you'll make the right choice 💙",
      'Hey, just pausing here with you for a moment. Is this exactly what you want to say? Sometimes taking a second look helps ✨',
      "I'm curious - if you got this message, how would it land with you? Just something to think about. I trust your judgment 💙",
      "Before you send, I'm just wondering - does this message represent your best self? You've got great instincts ✨",
    ]
    return pickDifferentResponse(amberResponses, previousResponse)
  } else if (lowerClassification === 'red') {
    const redResponses = [
      "Hey, I care about you, so I want to gently share something. Those words can really affect people. I know that's probably not what you want. Want to try saying it a different way? I believe in you 💙",
      "I'm on your side, always. But I think this message might not come across the way you mean it. The real you is kind - can we find better words together? ✨",
      "I know things can get frustrating sometimes. Your feelings are valid. But these words might hurt someone. You're better than that, and I know you know it 💙",
      "Let's take a breath together. I understand you might be upset, but I don't want you to regret this message later. What do you really want to say? ✨",
    ]
    return pickDifferentResponse(redResponses, previousResponse)
  }

  // Default mentor presence - varied
  const defaultResponses = [
    "I'm here with you! Remember, I'm always cheering you on 💙",
    "Just checking in! I'm here whenever you need me ✨",
    "Hey friend! I'm right here if you want to talk 💙",
    'I see you! Keep being your awesome self ✨',
  ]
  return pickDifferentResponse(defaultResponses, previousResponse)
}
