import { getParentBehaviourData } from "./behaviourData";
import { ChatAgentResponse, ChildBehaviour } from "./types";

const ESAFETY_GUARDRAILS = [
  "Lead with reassurance, highlight strengths before raising any flags.",
  "Use plain language about privacy: avoid sharing addresses, schools, or schedules.",
  "Invite parents to coach, not punish: model calm questions such as "What felt tricky?"",
  "Encourage taking breaks after tense chats and checking in on feelings.",
  "Keep next steps small and clear (one or two actions) so they feel doable.",
  "CRITICAL: Never reveal exact messages, search queries, or specific text children typed. Only share patterns, themes, and behavioral insights.",
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
  const messageLower = userMessage.toLowerCase();
  
  // Check if parent is asking vaguely for insights/summary
  const isVagueRequest = 
    messageLower.includes("insight") ||
    messageLower.includes("summary") ||
    (messageLower.includes("how is") && messageLower.length < 30) ||
    (messageLower.includes("how's") && messageLower.length < 30) ||
    (messageLower.includes("tell me about") && messageLower.length < 30);

  // If vague, ask clarifying question
  if (isVagueRequest) {
    return `I'd be happy to share insights about ${child.name}! What would you like to know? For example:\n\n• How they're doing overall?\n• Any specific concerns?\n• Recent patterns or trends?\n• Their emotional wellbeing?\n\nJust let me know what's on your mind.`;
  }

  // Check what they're asking about
  const isAskingAboutInterests = 
    messageLower.includes("into") ||
    messageLower.includes("interested") ||
    messageLower.includes("what are they") ||
    messageLower.includes("what's he") ||
    messageLower.includes("what's she");

  const isAskingAboutEmotions = 
    messageLower.includes("emotion") ||
    messageLower.includes("feeling") ||
    messageLower.includes("mood") ||
    messageLower.includes("distant") ||
    messageLower.includes("upset");

  const isAskingAboutBehavior = 
    messageLower.includes("behavior") ||
    messageLower.includes("behaviour") ||
    messageLower.includes("acting") ||
    messageLower.includes("doing");

  // Get ML scores if available
  const mlScores = child.mlScores;
  const themes = mlScores?.themes || [];
  const primaryEmotion = mlScores?.overallEmotion?.primary || "neutral";

  // Build response based on question type
  let reply = "";

  if (isAskingAboutInterests) {
    // What are they into?
    if (themes.length > 0) {
      const mainThemes = themes.slice(0, 2).join(" and ");
      reply = `Based on recent patterns, ${child.name} has been exploring ${mainThemes}. `;
    } else {
      reply = `Based on recent patterns, ${child.name} has been focusing on ${child.focusTheme.toLowerCase()}. `;
    }
    
    if (primaryEmotion !== "neutral") {
      reply += `Their overall emotional tone has been ${primaryEmotion}, which suggests they're engaging with content that resonates with them. `;
    }
    
    reply += `Would you like me to give you a summary of ${child.name}'s recent themes?`;
  } else if (isAskingAboutEmotions) {
    // Emotional state
    if (mlScores?.positivityScore) {
      const positivity = mlScores.positivityScore;
      if (positivity >= 70) {
        reply = `${child.name} has been showing mostly positive emotions recently. `;
      } else if (positivity >= 50) {
        reply = `${child.name} has been experiencing a mix of emotions, with some ups and downs. `;
      } else {
        reply = `${child.name} has been showing some challenging emotions lately. `;
      }
    } else {
      reply = `${child.name}'s emotional patterns show ${primaryEmotion} as the primary emotion. `;
    }
    
    if (messageLower.includes("distant")) {
      reply += `If they've seemed distant, it might be worth checking in gently. `;
    }
    
    reply += `Would you like articles that help you have a talk with your kids about emotions?`;
  } else if (isAskingAboutBehavior) {
    // Behavior
    const progress = child.positiveProgress.length 
      ? child.positiveProgress[0]
      : null;
    const flags = child.gentleFlags.length 
      ? child.gentleFlags[0]
      : null;

    reply = `${child.name} is showing ${child.overallTrend.toLowerCase()} patterns overall. `;
    
    if (progress) {
      reply += `A positive note: ${progress.toLowerCase()}. `;
    }
    
    if (flags) {
      reply += `One gentle watchpoint: ${flags.toLowerCase()}. `;
    }
    
    reply += `Do you need help with this? I can suggest conversation starters.`;
  } else {
    // General response
    const progress = child.positiveProgress.length 
      ? child.positiveProgress[0]
      : null;
    const flags = child.gentleFlags.length 
      ? child.gentleFlags[0]
      : null;

    reply = `${child.name} is doing well overall. The main theme this week is ${child.focusTheme.toLowerCase()}, and things are ${child.overallTrend.toLowerCase()}. `;
    
    if (progress) {
      reply += `A positive note: ${progress.toLowerCase()}. `;
    }
    
    if (flags) {
      reply += `One gentle watchpoint: ${flags.toLowerCase()}. `;
    }
    
    reply += `Would you like more details on any specific area?`;
  }

  return reply;
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
