import { getParentBehaviourData } from "./behaviourData";
import { ChatAgentResponse, ChildBehaviour } from "./types";

const ESAFETY_GUARDRAILS = [
  "Lead with reassurance, highlight strengths before raising any flags.",
  "Use plain language about privacy: avoid sharing addresses, schools, or schedules.",
  "Invite parents to coach, not punish: model calm questions such as “What felt tricky?”",
  "Encourage taking breaks after tense chats and checking in on feelings.",
  "Keep next steps small and clear (one or two actions) so they feel doable.",
];

function buildHighlights(child: ChildBehaviour) {
  return [
    `Weekly summary: ${child.weeklySummary}`,
    `Focus theme: ${child.focusTheme} (${child.overallTrend.toLowerCase()})`,
    `Positive progress: ${child.positiveProgress.join("; ") || "Noted but calm"}`,
    `Gentle flags: ${child.gentleFlags.join("; ") || "None this week"}`,
  ].join("\n");
}

function craftReply(userMessage: string, child: ChildBehaviour): string {
  const safetyLines = ESAFETY_GUARDRAILS.slice(0, 3)
    .map((tip) => `• ${tip}`)
    .join("\n");

  const progress = child.positiveProgress.length ? child.positiveProgress.map((item) => `• ${item}`).join("\n") : "• No major shifts, keep reinforcing calm routines.";
  const flags = child.gentleFlags.length ? child.gentleFlags.map((item) => `• ${item}`).join("\n") : "• No flags noted this week.";

  return [
    `I’m here with an eSafety-aligned check-in for ${child.name}.`,
    `Here’s how their week looked:`,
    `• Theme: ${child.focusTheme} (${child.overallTrend})`,
    `• Best day: ${child.bestDay}`,
    `• Kind interactions: ${child.kindInteractions}, potential risk moments: ${child.potentialRisks}, privacy nudges: ${child.privacyWarnings}`,
    ``,
    `What went well`,
    progress,
    ``,
    `Gentle watchpoints`,
    flags,
    ``,
    `How to reply in the chat (grounded in eSafety guidance):`,
    safetyLines,
    ``,
    `Parent asked: “${userMessage}”`,
    `Try a calm response like: “I saw you pause before sharing details — proud of you. Want to walk me through what felt tricky?”`,
  ].join("\n");
}

function shouldGenerateVideo(message: string): boolean {
  const lowered = message.toLowerCase();
  return lowered.includes("video") || lowered.includes("sora") || lowered.includes("clip");
}

export function runParentAgent(userMessage: string, childId?: string): ChatAgentResponse {
  const dataset = getParentBehaviourData();
  const targetChild = dataset.children.find((child) => child.id === childId) ?? dataset.children[0];

  const reply = craftReply(userMessage, targetChild);
  const includeVideo = shouldGenerateVideo(userMessage);

  return {
    reply,
    childId: targetChild.id,
    videoPlan: includeVideo
      ? {
        title: `Sora clip: ${targetChild.name}'s ${targetChild.focusTheme.toLowerCase()} focus`,
        prompt: `Generate a 45-second calm coaching video for ${targetChild.name}'s parent about ${targetChild.focusTheme}. Include positives (${targetChild.positiveProgress.join("; ")}) and gentle flags (${targetChild.gentleFlags.join("; ")}).`,
        status: "mocked",
        note: "Ready for OpenAI Sora when connected. Currently returning a mock preview only.",
      }
      : undefined,
    highlights: {
      weeklySummary: targetChild.weeklySummary,
      focusTheme: targetChild.focusTheme,
      positiveProgress: targetChild.positiveProgress,
      gentleFlags: targetChild.gentleFlags,
    },
  };
}
