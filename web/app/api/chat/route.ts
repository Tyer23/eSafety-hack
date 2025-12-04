import { NextResponse } from "next/server";
import { getParentBehaviourData } from "@/lib/behaviourData";
import { runParentAgent } from "@/lib/parentAgent";

const ESAFETY_GUARDRAILS = [
  "Lead with reassurance; celebrate strengths before raising flags.",
  "Use plain language about privacy: avoid sharing addresses, schools, schedules.",
  "Invite parents to coach, not punish: model calm questions like “What felt tricky?”",
  "Encourage breaks after tense chats and check in on feelings.",
  "Keep next steps small and doable (one or two actions)."
];

function shouldGenerateVideo(message: string): boolean {
  const lowered = message.toLowerCase();
  return lowered.includes("video") || lowered.includes("sora") || lowered.includes("clip");
}

export async function POST(request: Request) {
  const { message, childId } = await request.json();

  if (!message || typeof message !== "string") {
    return NextResponse.json({ error: "Message is required." }, { status: 400 });
  }

  const data = getParentBehaviourData();
  const child = data.children.find((item) => item.id === childId) ?? data.children[0];
  const includeVideo = shouldGenerateVideo(message);

  const systemPrompt = [
    "You are KindNet, an eSafety-aligned parenting assistant.",
    "Follow eSafety.gov.au spirit: reassure first, plain language, privacy-first, coaching over punishment.",
    "Return concise JSON with keys:",
    "- reply: empathetic, 3-6 sentences.",
    "- highlights: weeklySummary, focusTheme, positiveProgress (list), gentleFlags (list).",
    "- videoPlan (optional only if video_requested=true): title, prompt, status='mocked', note.",
    "Avoid hallucinating specifics; use provided child data only.",
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
