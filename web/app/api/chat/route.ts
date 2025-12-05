import { NextResponse } from "next/server";
import { getParentBehaviourData } from "@/lib/behaviourData";
import { runParentAgent } from "@/lib/parentAgent";

const ESAFETY_GUARDRAILS = [
  "Lead with reassurance; celebrate strengths before raising flags.",
  "Use plain language about privacy: avoid sharing addresses, schools, schedules.",
  "Invite parents to coach, not punish: model calm questions like 'What felt tricky?'",
  "Encourage breaks after tense chats and check in on feelings.",
  "Keep next steps small and doable (one or two actions).",
  "CRITICAL: Never reveal exact messages, search queries, or specific text children typed. Only share patterns, themes, and behavioral insights.",
];

function shouldGenerateVideo(message: string): boolean {
  const lowered = message.toLowerCase();
  return lowered.includes("video") || lowered.includes("sora") || lowered.includes("clip");
}

export async function POST(request: Request) {
  const { message, childId, sessionId } = await request.json();

  if (!message || typeof message !== "string") {
    return NextResponse.json({ error: "Message is required." }, { status: 400 });
  }

  const data = getParentBehaviourData();
  const child = data.children.find((item) => item.id === childId) ?? data.children[0];
  const includeVideo = shouldGenerateVideo(message);

  const systemPrompt = [
    "You are KindNet, an eSafety-aligned parenting assistant.",
    "Follow eSafety.gov.au spirit: reassure first, plain language, privacy-first, coaching over punishment.",
    "",
    "CRITICAL PRIVACY RULE: NEVER reveal exact messages, search queries, or specific text that children typed.",
    "This is about letting children learn privately. Only share:",
    "- Patterns and themes (e.g., 'curious about friendships', 'exploring emotions')",
    "- General categories (e.g., 'searched about social situations', 'messaged friends')",
    "- Behavioral insights (e.g., 'showed kindness', 'paused before sharing')",
    "- Emotional patterns (e.g., 'mostly positive emotions', 'some frustration')",
    "NEVER say: 'They searched for X' or 'They typed Y' or quote exact words.",
    "",
    "RESPONSE GUIDELINES:",
    "1. Answer the specific question asked - don't repeat previous responses.",
    "2. Use available data to answer:",
    "   - If asked 'what is he into?' or 'what are they interested in?' → Use themes, overallEmotion, and focusTheme",
    "   - If asked about emotions/feelings → Use overallEmotion and positivityScore",
    "   - If asked about behavior → Use kindnessScore, positiveProgress, gentleFlags",
    "   - If asked about concerns → Reference gentleFlags and potentialRisks",
    "3. Keep responses conversational, 2-4 sentences.",
    "4. ALWAYS end with a helpful follow-up prompt like:",
    "   - 'Would you like me to give you a summary of [child]'s recent themes?'",
    "   - 'Do you need help with this? I can suggest conversation starters.'",
    "   - 'Would you like articles that help you have a talk with your kids about this?'",
    "   - 'Would you like more details on any specific area?'",
    "   Rotate these prompts naturally based on context.",
    "",
    "Return concise JSON with keys:",
    "- reply: Natural, conversational response that answers the question. Include helpful follow-up prompt at end.",
    "- highlights: weeklySummary, focusTheme, positiveProgress (list), gentleFlags (list).",
    "- videoPlan (optional only if video_requested=true): title, prompt, status='mocked', note.",
    "",
    "ML-based scores are available in child.mlScores:",
    "- kindnessScore (0-100), positivityScore (0-100), privacyAwarenessScore (0-100), digitalWellbeingScore (0-100)",
    "- overallEmotion: Primary emotion and distribution (use this for 'what are they into?' questions)",
    "- themes: Key themes detected (use this for interests and patterns)",
    "Reference these naturally when relevant to answer the question.",
  ].join(" ");

  const userPayload = {
    parent_message: message,
    video_requested: includeVideo,
    child: {
      id: child.id,
      name: child.name,
      focusTheme: child.focusTheme,
      weeklySummary: child.weeklySummary,
      bestDay: child.bestDay,
      overallTrend: child.overallTrend,
      kindInteractions: child.kindInteractions,
      potentialRisks: child.potentialRisks,
      privacyWarnings: child.privacyWarnings,
      positiveProgress: child.positiveProgress,
      gentleFlags: child.gentleFlags,
      videoPrompt: child.videoPrompt,
      // ML-based scores calculated from classification data
      mlScores: child.mlScores ? {
        kindnessScore: child.mlScores.kindnessScore,
        positivityScore: child.mlScores.positivityScore,
        privacyAwarenessScore: child.mlScores.privacyAwarenessScore,
        digitalWellbeingScore: child.mlScores.digitalWellbeingScore,
        overallEmotion: child.mlScores.overallEmotion,
        themes: child.mlScores.themes,
      } : undefined,
    },
    esafety_guardrails: ESAFETY_GUARDRAILS,
  };

  const openaiKey = process.env.OPENAI_API_KEY;
  if (openaiKey) {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          temperature: 0.2,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: JSON.stringify(userPayload) },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI call failed with status ${response.status}`);
      }

      const completion = await response.json();
      const content = completion?.choices?.[0]?.message?.content ?? "";
      const parsed = content ? JSON.parse(content) : null;

      if (parsed) {
        return NextResponse.json({
          childId: child.id,
          reply: parsed.reply,
          highlights: parsed.highlights ?? {
            weeklySummary: child.weeklySummary,
            focusTheme: child.focusTheme,
            positiveProgress: child.positiveProgress,
            gentleFlags: child.gentleFlags,
          },
          videoPlan: parsed.videoPlan && includeVideo ? parsed.videoPlan : undefined,
        });
      }
    } catch (error) {
      console.error("OpenAI call failed; falling back to local agent", error);
    }
  }

  // Fallback to local agent so the UI never 500s.
  const fallback = runParentAgent(message, childId);
  return NextResponse.json(fallback);
}
