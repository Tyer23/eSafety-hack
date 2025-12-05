import fs from "fs";
import path from "path";

/**
 * Classification record from CSV
 */
export interface ClassificationRecord {
  id: string;
  timestamp: string;
  text: string;
  context: "search" | "message";
  classification: "green" | "yellow" | "red";
  confidence: number;
  toxicity_score: number;
  primary_emotion: string;
  emotion_intensity: number;
  intent: string;
  detected_issues: string;
  has_feedback: "yes" | "no";
}

/**
 * Aggregated scores and themes for a child
 */
export interface ChildScores {
  kindnessScore: number; // 0-100
  positivityScore: number; // 0-100
  privacyAwarenessScore: number; // 0-100
  digitalWellbeingScore: number; // 0-100
  overallEmotion: {
    primary: string; // Most common emotion
    distribution: Record<string, number>; // Emotion -> percentage
  };
  themes: string[]; // Key themes detected
}

/**
 * Parse CSV line handling quoted fields
 */
function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (char === "," && !inQuotes) {
      values.push(current.trim());
      current = "";
      continue;
    }
    current += char;
  }
  values.push(current.trim());
  return values;
}

/**
 * Load classification records from CSV
 */
function loadClassificationCSV(kidId: string): ClassificationRecord[] {
  const csvPath = path.join(
    process.cwd(),
    "data",
    kidId === "kid_01" ? "jamieClassification.csv" : "emmaClassification.csv"
  );

  if (!fs.existsSync(csvPath)) {
    console.warn(`Classification CSV not found: ${csvPath}`);
    return [];
  }

  const raw = fs.readFileSync(csvPath, "utf8");
  const lines = raw.trim().split(/\r?\n/);
  const [, ...rows] = lines; // Skip header

  return rows
    .map((line) => {
      const [
        id,
        timestamp,
        text,
        context,
        classification,
        confidence,
        toxicity_score,
        toxicity_confidence,
        toxicity_label,
        primary_emotion,
        emotion_intensity,
        intent,
        detected_issues,
        has_feedback,
        feedback_message,
        processing_time_ms,
        used_llm,
      ] = parseCSVLine(line);

      return {
        id,
        timestamp,
        text,
        context: (context as "search" | "message") || "message",
        classification: (classification as "green" | "yellow" | "red") || "green",
        confidence: parseFloat(confidence) || 0,
        toxicity_score: parseFloat(toxicity_score) || 0,
        primary_emotion: primary_emotion || "neutral",
        emotion_intensity: parseFloat(emotion_intensity) || 0,
        intent: intent || "neutral",
        detected_issues: detected_issues || "",
        has_feedback: (has_feedback as "yes" | "no") || "no",
      };
    })
    .filter((record) => record.id && record.timestamp); // Filter invalid rows
}

/**
 * Calculate Kindness Score (0-100)
 * 
 * Algorithm:
 * - Base score from green classifications (green = +points, yellow = neutral, red = -points)
 * - Bonus for positive intents (positive, neutral)
 * - Penalty for negative intents (criticism, personal_attack, threat)
 * - Penalty for high toxicity scores
 * - Bonus for kind language patterns (detected in text analysis)
 */
function calculateKindnessScore(records: ClassificationRecord[]): number {
  if (records.length === 0) return 50; // Neutral default

  let score = 50; // Start at neutral

  records.forEach((record) => {
    // Classification impact
    if (record.classification === "green") {
      score += 2; // Green messages boost kindness
    } else if (record.classification === "yellow") {
      score -= 1; // Yellow messages slightly reduce
    } else if (record.classification === "red") {
      score -= 5; // Red messages significantly reduce
    }

    // Intent impact
    const intent = record.intent.toLowerCase();
    if (intent === "positive") {
      score += 1.5;
    } else if (intent === "neutral") {
      // Neutral is fine, no change
    } else if (
      intent.includes("criticism") ||
      intent.includes("attack") ||
      intent.includes("threat")
    ) {
      score -= 3;
    }

    // Toxicity penalty
    if (record.toxicity_score > 0.5) {
      score -= record.toxicity_score * 10; // Scale toxicity impact
    }
  });

  // Normalize to 0-100 range
  score = Math.max(0, Math.min(100, score));

  return Math.round(score);
}

/**
 * Calculate Positivity Score (0-100)
 * 
 * Algorithm:
 * - Based on joy emotions and positive intents
 * - Higher emotion_intensity for joy = higher score
 * - Positive intents boost score
 * - Negative emotions (anger, sadness) reduce score
 * - Green classifications boost, red reduce
 */
function calculatePositivityScore(records: ClassificationRecord[]): number {
  if (records.length === 0) return 50;

  let positiveCount = 0;
  let totalIntensity = 0;

  records.forEach((record) => {
    const emotion = record.primary_emotion.toLowerCase();
    const intent = record.intent.toLowerCase();

    // Joy and positive emotions
    if (emotion === "joy" || emotion === "surprise") {
      positiveCount += 1;
      totalIntensity += record.emotion_intensity;
    }

    // Positive intents
    if (intent === "positive") {
      positiveCount += 0.5;
      totalIntensity += 0.5;
    }

    // Negative emotions reduce positivity
    if (emotion === "anger" || emotion === "sadness" || emotion === "fear") {
      positiveCount -= 0.3;
      totalIntensity -= record.emotion_intensity * 0.3;
    }

    // Classification impact
    if (record.classification === "green") {
      positiveCount += 0.2;
    } else if (record.classification === "red") {
      positiveCount -= 0.5;
    }
  });

  // Calculate average positivity
  const avgPositivity = totalIntensity / Math.max(1, records.length);
  const positivityRatio = positiveCount / Math.max(1, records.length);

  // Combine into 0-100 score
  const score = (avgPositivity * 50 + positivityRatio * 50);
  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Calculate Privacy Awareness Score (0-100)
 * 
 * Algorithm:
 * - Penalty for privacy-related detected issues
 * - Check for privacy keywords in text (address, phone, school, etc.)
 * - Lower toxicity in privacy contexts = better awareness
 * - Green classifications in privacy-related searches = good awareness
 */
function calculatePrivacyAwarenessScore(records: ClassificationRecord[]): number {
  if (records.length === 0) return 75; // Default to good awareness

  let score = 75; // Start with good awareness

  const privacyKeywords = [
    "address",
    "phone",
    "school",
    "home",
    "location",
    "where i live",
    "my house",
    "personal info",
    "private",
  ];

  records.forEach((record) => {
    const text = record.text.toLowerCase();
    const issues = record.detected_issues.toLowerCase();

    // Check for privacy-related content
    const hasPrivacyContent = privacyKeywords.some((keyword) =>
      text.includes(keyword)
    );

    if (hasPrivacyContent) {
      // If privacy content but green classification = good awareness (didn't share)
      if (record.classification === "green") {
        score += 1; // Good - aware not to share
      } else if (record.classification === "yellow" || record.classification === "red") {
        score -= 3; // Bad - shared private info
      }
    }

    // Privacy-related detected issues
    if (issues.includes("privacy") || issues.includes("personal")) {
      score -= 5;
    }

    // High toxicity in privacy context = bad
    if (hasPrivacyContent && record.toxicity_score > 0.3) {
      score -= 2;
    }
  });

  // Normalize to 0-100
  score = Math.max(0, Math.min(100, score));
  return Math.round(score);
}

/**
 * Calculate Digital Wellbeing Score (0-100)
 * 
 * Algorithm:
 * - Based on time patterns (late-night usage = lower score)
 * - Balance of search vs message (too many searches might indicate overuse)
 * - Emotion patterns (frustration, anger late at night = concern)
 * - Classification patterns (too many red/yellow = lower wellbeing)
 */
function calculateDigitalWellbeingScore(records: ClassificationRecord[]): number {
  if (records.length === 0) return 75;

  let score = 75;
  let lateNightCount = 0;
  let highIntensityNegativeCount = 0;
  let redYellowCount = 0;

  records.forEach((record) => {
    // Parse timestamp to get hour
    try {
      const date = new Date(record.timestamp);
      const hour = date.getHours();

      // Late night usage (10 PM - 6 AM) = concern
      if (hour >= 22 || hour < 6) {
        lateNightCount += 1;
        score -= 0.5;
      }
    } catch (e) {
      // Invalid timestamp, skip
    }

    // High intensity negative emotions = concern
    const emotion = record.primary_emotion.toLowerCase();
    if (
      (emotion === "anger" || emotion === "sadness" || emotion === "fear") &&
      record.emotion_intensity > 0.7
    ) {
      highIntensityNegativeCount += 1;
      score -= 1;
    }

    // Red/yellow classifications = lower wellbeing
    if (record.classification === "red") {
      redYellowCount += 1;
      score -= 2;
    } else if (record.classification === "yellow") {
      redYellowCount += 1;
      score -= 1;
    }
  });

  // Late night usage penalty
  const lateNightRatio = lateNightCount / Math.max(1, records.length);
  if (lateNightRatio > 0.2) {
    score -= 10; // More than 20% late night = significant concern
  }

  // High negative emotion ratio
  const negativeRatio = highIntensityNegativeCount / Math.max(1, records.length);
  if (negativeRatio > 0.15) {
    score -= 5;
  }

  // Normalize to 0-100
  score = Math.max(0, Math.min(100, score));
  return Math.round(score);
}

/**
 * Calculate overall emotion theme
 */
function calculateOverallEmotion(records: ClassificationRecord[]): {
  primary: string;
  distribution: Record<string, number>;
} {
  if (records.length === 0) {
    return { primary: "neutral", distribution: { neutral: 100 } };
  }

  const emotionCounts: Record<string, number> = {};
  let totalIntensity = 0;

  records.forEach((record) => {
    const emotion = record.primary_emotion.toLowerCase();
    const intensity = record.emotion_intensity;

    if (!emotionCounts[emotion]) {
      emotionCounts[emotion] = 0;
    }

    // Weight by intensity
    emotionCounts[emotion] += intensity;
    totalIntensity += intensity;
  });

  // Convert to percentages
  const distribution: Record<string, number> = {};
  let maxEmotion = "neutral";
  let maxValue = 0;

  Object.entries(emotionCounts).forEach(([emotion, weightedCount]) => {
    const percentage = Math.round((weightedCount / totalIntensity) * 100);
    distribution[emotion] = percentage;

    if (weightedCount > maxValue) {
      maxValue = weightedCount;
      maxEmotion = emotion;
    }
  });

  return {
    primary: maxEmotion,
    distribution,
  };
}

/**
 * Extract themes from records
 */
function extractThemes(records: ClassificationRecord[]): string[] {
  const themes: string[] = [];

  // Count common intents
  const intentCounts: Record<string, number> = {};
  const issueCounts: Record<string, number> = {};

  records.forEach((record) => {
    const intent = record.intent.toLowerCase();
    if (intent && intent !== "neutral") {
      intentCounts[intent] = (intentCounts[intent] || 0) + 1;
    }

    if (record.detected_issues) {
      record.detected_issues
        .split(",")
        .map((i) => i.trim().toLowerCase())
        .filter(Boolean)
        .forEach((issue) => {
          issueCounts[issue] = (issueCounts[issue] || 0) + 1;
        });
    }
  });

  // Top intents become themes
  const topIntents = Object.entries(intentCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([intent]) => intent);

  themes.push(...topIntents);

  // Common issues become themes
  const topIssues = Object.entries(issueCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([issue]) => issue);

  themes.push(...topIssues);

  // Get unique themes
  const uniqueThemes: string[] = [];
  const seen = new Set<string>();
  for (const theme of themes) {
    if (!seen.has(theme)) {
      seen.add(theme);
      uniqueThemes.push(theme);
    }
  }
  return uniqueThemes.slice(0, 5); // Max 5 themes
}

/**
 * Aggregate classification data and calculate scores for a child
 */
export function aggregateChildScores(kidId: string): ChildScores {
  const records = loadClassificationCSV(kidId);

  if (records.length === 0) {
    // Return default scores if no data
    return {
      kindnessScore: 50,
      positivityScore: 50,
      privacyAwarenessScore: 75,
      digitalWellbeingScore: 75,
      overallEmotion: {
        primary: "neutral",
        distribution: { neutral: 100 },
      },
      themes: [],
    };
  }

  return {
    kindnessScore: calculateKindnessScore(records),
    positivityScore: calculatePositivityScore(records),
    privacyAwarenessScore: calculatePrivacyAwarenessScore(records),
    digitalWellbeingScore: calculateDigitalWellbeingScore(records),
    overallEmotion: calculateOverallEmotion(records),
    themes: extractThemes(records),
  };
}

/**
 * Get cached scores (with simple in-memory cache)
 */
let scoreCache: Record<string, { scores: ChildScores; timestamp: number }> = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export function getChildScores(kidId: string, useCache = true): ChildScores {
  const cacheKey = kidId;
  const now = Date.now();

  if (useCache && scoreCache[cacheKey]) {
    const cached = scoreCache[cacheKey];
    if (now - cached.timestamp < CACHE_TTL) {
      return cached.scores;
    }
  }

  const scores = aggregateChildScores(kidId);
  scoreCache[cacheKey] = { scores, timestamp: now };
  return scores;
}

