# ML Scores Calculation Algorithms

This document explains how the four core scores and emotion themes are calculated from the ML classification data (`jamieClassification.csv` and `emmaClassification.csv`).

---

## 📊 Score Overview

All scores are calculated on a **0-100 scale**, where:
- **0-40**: Needs attention
- **41-70**: Good
- **71-85**: Very good
- **86-100**: Excellent

---

## 1. Kindness Score (0-100)

### Algorithm

The kindness score measures how kind and constructive a child's online interactions are.

**Base Score**: Starts at 50 (neutral)

**Scoring Factors**:

1. **Classification Impact**:
   - `green` classification: +2 points per message
   - `yellow` classification: -1 point per message
   - `red` classification: -5 points per message

2. **Intent Impact**:
   - `positive` intent: +1.5 points per message
   - `neutral` intent: No change
   - `criticism`, `personal_attack`, `threat` intents: -3 points per message

3. **Toxicity Penalty**:
   - If `toxicity_score > 0.5`: Subtract `toxicity_score × 10` points
   - Higher toxicity = larger penalty

**Final Score**: Normalized to 0-100 range

### Example Calculation

For a child with 100 messages:
- 80 green, 15 yellow, 5 red
- 60 positive intents, 30 neutral, 10 criticism
- Average toxicity: 0.2

```
Base: 50
Green: +160 (80 × 2)
Yellow: -15 (15 × 1)
Red: -25 (5 × 5)
Positive: +90 (60 × 1.5)
Criticism: -30 (10 × 3)
Toxicity: -20 (0.2 × 10 × 10 messages with high toxicity)

Total: 210 → Normalized to 100 (capped)
```

---

## 2. Positivity Score (0-100)

### Algorithm

The positivity score measures the overall positive emotional tone of a child's messages.

**Scoring Factors**:

1. **Emotion Analysis**:
   - `joy` or `surprise` emotions: Count as positive, weighted by `emotion_intensity`
   - `anger`, `sadness`, `fear` emotions: Count as negative, weighted by `emotion_intensity`

2. **Intent Analysis**:
   - `positive` intent: +0.5 to positive count, +0.5 to intensity
   - Negative intents reduce positivity

3. **Classification Impact**:
   - `green` classification: +0.2 to positive count
   - `red` classification: -0.5 to positive count

**Final Score**: 
```
score = (average_emotion_intensity × 50) + (positivity_ratio × 50)
```

Where:
- `average_emotion_intensity`: Average intensity of positive emotions
- `positivity_ratio`: Ratio of positive messages to total messages

### Example Calculation

For a child with 100 messages:
- 60 messages with `joy` emotion (avg intensity: 0.8)
- 20 messages with `positive` intent
- 10 messages with `anger` emotion (avg intensity: 0.6)

```
Positive count: 60 + (20 × 0.5) + (80 × 0.2) - (10 × 0.3) = 81
Average intensity: (60 × 0.8 + 20 × 0.5) / 100 = 0.58
Positivity ratio: 81 / 100 = 0.81

Score: (0.58 × 50) + (0.81 × 50) = 29 + 40.5 = 69.5 → 70
```

---

## 3. Privacy Awareness Score (0-100)

### Algorithm

The privacy awareness score measures how well a child protects their personal information online.

**Base Score**: Starts at 75 (good awareness by default)

**Scoring Factors**:

1. **Privacy Content Detection**:
   - Checks for privacy-related keywords: `address`, `phone`, `school`, `home`, `location`, `where i live`, `my house`, `personal info`, `private`
   - If privacy content found:
     - `green` classification: +1 point (aware not to share)
     - `yellow` or `red` classification: -3 points (shared private info)

2. **Privacy-Related Issues**:
   - If `detected_issues` contains `privacy` or `personal`: -5 points per occurrence

3. **Toxicity in Privacy Context**:
   - If privacy content + `toxicity_score > 0.3`: -2 points per occurrence

**Final Score**: Normalized to 0-100 range

### Example Calculation

For a child with 100 messages:
- 5 messages mention privacy keywords
- 3 of those are `green` (didn't share), 2 are `yellow` (shared)
- 1 message has privacy-related detected issue
- 1 message has high toxicity in privacy context

```
Base: 75
Privacy content (green): +3 (3 × 1)
Privacy content (yellow): -6 (2 × 3)
Privacy issue: -5
Toxicity in privacy: -2

Total: 65
```

---

## 4. Digital Wellbeing Score (0-100)

### Algorithm

The digital wellbeing score measures healthy digital habits, including time patterns and emotional balance.

**Base Score**: Starts at 75 (good wellbeing by default)

**Scoring Factors**:

1. **Late Night Usage**:
   - Messages between 10 PM - 6 AM: -0.5 points per message
   - If >20% of messages are late night: -10 additional points

2. **High Intensity Negative Emotions**:
   - `anger`, `sadness`, or `fear` with `emotion_intensity > 0.7`: -1 point per message
   - If >15% of messages have high intensity negative emotions: -5 additional points

3. **Classification Balance**:
   - `red` classification: -2 points per message
   - `yellow` classification: -1 point per message

**Final Score**: Normalized to 0-100 range

### Example Calculation

For a child with 100 messages:
- 25 messages between 10 PM - 6 AM (25% late night)
- 10 messages with high intensity negative emotions (10%)
- 5 red, 10 yellow classifications

```
Base: 75
Late night: -12.5 (25 × 0.5)
Late night penalty: -10 (25% > 20%)
Negative emotions: -10 (10 × 1)
Red classifications: -10 (5 × 2)
Yellow classifications: -10 (10 × 1)

Total: 22.5 → Normalized to 23
```

---

## 5. Overall Emotion Theme

### Algorithm

The overall emotion theme identifies the primary emotional state of the child based on their messages.

**Calculation**:

1. **Weighted Emotion Count**:
   - For each message, add `emotion_intensity` to the count for that `primary_emotion`
   - This weights strong emotions more than weak ones

2. **Distribution Calculation**:
   - Convert weighted counts to percentages
   - Each emotion gets: `(emotion_weighted_count / total_weighted_count) × 100`

3. **Primary Emotion**:
   - The emotion with the highest weighted count becomes the `primary` emotion

### Example Calculation

For a child with 100 messages:
- 50 messages with `joy` (avg intensity: 0.8) → weighted: 40
- 30 messages with `neutral` (avg intensity: 0.5) → weighted: 15
- 20 messages with `anger` (avg intensity: 0.7) → weighted: 14

```
Total weighted: 40 + 15 + 14 = 69

Distribution:
- joy: (40 / 69) × 100 = 58%
- neutral: (15 / 69) × 100 = 22%
- anger: (14 / 69) × 100 = 20%

Primary: joy
```

---

## 6. Themes

### Algorithm

Themes are extracted from common patterns in intents and detected issues.

**Calculation**:

1. **Intent Themes**:
   - Count occurrences of each `intent` (excluding `neutral`)
   - Top 2 intents become themes

2. **Issue Themes**:
   - Parse `detected_issues` (comma-separated)
   - Count occurrences of each issue
   - Top 2 issues become themes

3. **Final Themes**:
   - Combine unique intents and issues
   - Return up to 5 unique themes

### Example

For a child with 100 messages:
- 40 messages with `positive` intent
- 20 messages with `criticism` intent
- 15 messages with `personal_attack` detected issue
- 10 messages with `harsh_criticism` detected issue

```
Top intents: positive (40), criticism (20)
Top issues: personal_attack (15), harsh_criticism (10)

Themes: ["positive", "criticism", "personal_attack", "harsh_criticism"]
```

---

## 📈 How Scores Are Used

### In AI Agent Responses

When parents ask for summaries, the AI agent can reference these scores:

- **"How is Jamie doing?"** → Agent can mention kindness score (e.g., "Jamie's kindness score is 85, showing very positive interactions")
- **"What's Emma's emotional state?"** → Agent can reference overall emotion theme (e.g., "Emma's primary emotion is joy, with 60% of messages showing positive emotions")
- **"Is my child being safe online?"** → Agent can reference privacy awareness and digital wellbeing scores

### Data Availability

Scores are automatically calculated and included in:
- `ChildBehaviour.mlScores` object
- Passed to OpenAI GPT-4o-mini in chat API
- Available to fallback `parentAgent.ts` (though currently uses static data)

---

## 🔄 Data Flow

```
jamieClassification.csv / emmaClassification.csv
    ↓
classificationAggregator.ts
    ↓
aggregateChildScores(kidId)
    ↓
ChildScores {
  kindnessScore: 85,
  positivityScore: 72,
  privacyAwarenessScore: 88,
  digitalWellbeingScore: 78,
  overallEmotion: { primary: "joy", distribution: {...} },
  themes: ["positive", "curiosity"]
}
    ↓
behaviourData.ts (enriches ChildBehaviour)
    ↓
/api/chat/route.ts (includes in AI payload)
    ↓
AI Agent can reference scores in responses
```

---

## 📝 Notes

- Scores are **cached for 5 minutes** to avoid recalculating on every request
- If classification CSV files are missing, scores default to neutral values (50-75)
- All scores are **rounded to integers** for display
- Algorithms are designed to be **interpretable** and **adjustable** based on real-world feedback

---

**Last Updated**: 2024-01-15  
**Version**: 1.0

