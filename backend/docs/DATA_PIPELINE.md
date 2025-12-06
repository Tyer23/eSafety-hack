# 📊 Data Pipeline Documentation

## Overview

This document describes the data flow between the **Child Interface (Mascot Model)** and the **Parent Dashboard**, including input/output formats, API endpoints, and data structures.

---

## 🎯 Two Use Cases

### 1. **Mascot Model (Child Interface)**
- **Purpose**: Real-time feedback to children as they type
- **Location**: Child browser interface (`/child/[kidId]`)
- **Flow**: Child types → ML analyzes → Guardian shows feedback

### 2. **Parent Dashboard**
- **Purpose**: Aggregated insights and patterns for parents
- **Location**: Parent dashboard (`/parent`, `/parent/insights`, `/parent/patterns`)
- **Flow**: Child data → Stored in DB/CSV → Aggregated → Parent views stats

---

## 📥 Model Input (What the ML Model Expects)

### API Endpoint: `POST /analyze`

**Request Body:**
```json
{
  "message": "string (max 500 characters)",
  "age_range": "8-10" | "11-13"  // Optional, defaults to "8-10"
}
```

**Example:**
```json
{
  "message": "You're stupid",
  "age_range": "8-10"
}
```

### From Child Interface

When a child submits text in the browser, the frontend should send:

```json
{
  "kidId": "kid_01",           // Required: identifies which child
  "username": "kid_01",         // Optional: additional reference
  "text": "the search query or message",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "context": "search" | "message",  // Where the text came from
  "age_range": "8-10" | "11-13"     // Optional: child's age range
}
```

**Note**: The ML model only needs `message` and `age_range`, but the full payload should be stored in DB/CSV for parent dashboard aggregation.

---

## 📤 Model Output (What the ML Model Returns)

### Response: `ProcessingResult`

**Full Structure:**
```json
{
  "success": true,
  "classification": "green" | "yellow" | "red",
  "confidence": 0.95,  // Float between 0.0 and 1.0
  
  "analysis": {
    "toxicity": {
      "score": 0.85,           // 0.0 to 1.0
      "confidence": 0.92,
      "label": "toxic"
    },
    "emotion": {
      "primary_emotion": "anger" | "joy" | "sadness" | "fear" | "surprise" | "disgust" | "neutral" | "frustration",
      "scores": {
        "anger": 0.7,
        "joy": 0.1,
        "sadness": 0.2
        // ... other emotions
      },
      "intensity": 0.8  // 0.0 to 1.0
    },
    "patterns": {
      "exclusion_detected": false,
      "harsh_criticism_detected": true,
      "dismissive_detected": false,
      "personal_attack_detected": true,
      "threat_detected": false,
      "profanity_detected": false,
      "hate_speech_detected": false,
      "sexual_content_detected": false,
      "bullying_detected": false,
      "self_harm_detected": false,
      "age_inappropriate_detected": false,
      "violence_detected": false,
      "matched_patterns": ["harsh_criticism", "personal_attack"]
    },
    "detected_issues": [
      "harsh_criticism",
      "personal_attack"
      // Possible values: harsh_criticism, personal_attack, exclusion_language,
      // dismissive_tone, threat, name_calling, profanity, hate_speech,
      // sexual_content, bullying, self_harm, age_inappropriate, violence
    ],
    "intent": "criticism" | "express_dislike" | "personal_attack" | "exclusion" | "positive" | "neutral" | "request" | "threat"
  },
  
  "feedback": {
    "main_message": "Those words can hurt others. Let's find a kinder way to express yourself!",
    "suggested_alternatives": [
      "I'm really frustrated right now",
      "This is making me upset",
      "I need to take a break"
    ],
    "communication_tip": "When we're upset, it helps to name our feelings instead of attacking others."
  },
  
  "educational": {
    "skill_focus": "Emotional regulation",
    "age_appropriate": true,
    "follow_up_question": "How do you think the other person might feel when they hear that?"
  },
  
  "metadata": {
    "processing_time_ms": 234.5,
    "model_versions": {
      "toxicity": "toxic-bert-v1",
      "emotion": "distilbert-emotion-v2",
      "feedback": "templates-v1"
    },
    "timestamp": "2024-01-15T10:30:00.123Z",
    "used_llm": true,        // Whether Hugging Face LLM was used
    "fallback_used": false    // Whether fallback templates were used
  },
  
  "error_message": null  // Only present if success = false
}
```

### Classification Levels

| Level | Value | Description | When It Appears |
|-------|-------|-------------|-----------------|
| 🟢 **GREEN** | `"green"` | Safe, constructive | Normal, positive, or neutral messages |
| 🟡 **YELLOW** | `"yellow"` | Needs work | Dismissive, mild criticism, exclusion language |
| 🔴 **RED** | `"red"` | Harmful | Profanity, threats, personal attacks, hate speech |

**Note**: `feedback` and `educational` are only present when classification is **YELLOW** or **RED** (not GREEN).

---

## 🔄 Data Flow

### For Mascot (Child Interface)

```
Child types text
    ↓
Frontend sends to: POST /analyze
    ↓
Backend ML Model processes
    ↓
Returns ProcessingResult
    ↓
Frontend shows:
  - Guardian color (green/yellow/red)
  - Feedback message (if YELLOW/RED)
  - Suggested alternatives
```

**Example Frontend Code:**
```typescript
const response = await fetch('http://localhost:8000/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: searchQuery,
    age_range: "8-10"  // or "11-13"
  })
});

const result: ProcessingResult = await response.json();

// Use result.classification for guardian color
// Use result.feedback for child feedback
// Store result + kidId in DB/CSV for parent dashboard
```

### For Parent Dashboard

```
Child submits text
    ↓
Frontend sends to ML model + stores in DB/CSV
    ↓
DB/CSV accumulates data over time
    ↓
Parent dashboard queries aggregated data
    ↓
Parent sees:
  - Weekly summaries
  - Theme trends (kindness, privacy, wellbeing)
  - Statistics (kind interactions, risk moments)
  - Calendar with daily performance
```

**Data to Store in DB/CSV:**
```json
{
  "id": "unique_id",
  "kidId": "kid_01",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "text": "original message",
  "context": "search" | "message",
  "classification": "green" | "yellow" | "red",
  "confidence": 0.95,
  "toxicity_score": 0.85,
  "primary_emotion": "anger",
  "detected_issues": ["harsh_criticism", "personal_attack"],
  "intent": "criticism"
}
```

**Note**: Store the full `ProcessingResult` or a simplified version. The parent dashboard will aggregate this data to show:
- Count of GREEN/YELLOW/RED messages per child
- Trends over time (weekly/monthly)
- Most common issues detected
- Emotion patterns

---

## 🔌 API Endpoints

### 1. Full Analysis
**Endpoint**: `POST /analyze`  
**Input**: `{ "message": string, "age_range": "8-10" | "11-13" }`  
**Output**: Full `ProcessingResult` with feedback

### 2. Quick Classification
**Endpoint**: `POST /classify`  
**Input**: `{ "message": string }`  
**Output**: `{ "classification": "green" | "yellow" | "red" }`  
**Use Case**: Fast classification without feedback (for real-time guardian color)

### 3. Batch Processing
**Endpoint**: `POST /batch`  
**Input**: `{ "messages": [string, ...], "age_range": "8-10" | "11-13" }`  
**Output**: `{ "count": number, "results": [ProcessingResult, ...] }`  
**Use Case**: Process multiple messages at once (for CSV import, bulk analysis)

### 4. Health Check
**Endpoint**: `GET /health`  
**Output**: `{ "status": "healthy", "ready": true }`

---

## 📊 Parent Dashboard Data Requirements

The parent dashboard needs **aggregated data**, not individual messages. Here's what to calculate:

### Weekly Summary
- Total messages per child
- Count of GREEN/YELLOW/RED classifications
- Most common detected issues
- Emotion trends

### Statistics Cards
- **Kind interactions**: Count of GREEN messages
- **Potential risk moments**: Count of YELLOW messages
- **Privacy warnings**: Count of messages with privacy-related issues
- **Digital wellbeing**: Overall score based on patterns

### Theme Trends
- **Kindness**: % of GREEN messages, trend over time
- **Privacy Awareness**: Count of privacy-related detections
- **Digital Wellbeing**: Screen time patterns, late-night usage

### Calendar Data
- Daily performance score per child
- Color-coded dots (green/yellow/red) based on daily average

---

## 🔗 Integration Points

### Child Interface → ML Model
- **When**: Every time child submits text (search or message)
- **What to send**: `{ message, age_range }` + metadata `{ kidId, timestamp, context }`
- **What to receive**: `ProcessingResult`
- **What to do**: 
  1. Show guardian feedback to child
  2. Store result in DB/CSV with `kidId` for parent dashboard

### Parent Dashboard → Aggregated Data
- **When**: Parent views dashboard (on page load, refresh)
- **What to query**: DB/CSV filtered by `kidId` and date range
- **What to calculate**: Aggregated stats, trends, summaries
- **What to display**: Charts, cards, calendar, summaries

---

## 📝 Example: Complete Flow

### Step 1: Child Submits Text
```typescript
// Child interface
const payload = {
  kidId: "kid_01",
  text: "You're stupid",
  timestamp: new Date().toISOString(),
  context: "search",
  age_range: "8-10"
};

// Send to ML model
const mlResponse = await fetch('http://localhost:8000/analyze', {
  method: 'POST',
  body: JSON.stringify({
    message: payload.text,
    age_range: payload.age_range
  })
});

const mlResult = await mlResponse.json();
// mlResult.classification = "red"
// mlResult.feedback = { main_message: "...", suggested_alternatives: [...] }
```

### Step 2: Store for Parent Dashboard
```typescript
// Store in DB/CSV
const record = {
  id: generateId(),
  kidId: payload.kidId,
  timestamp: payload.timestamp,
  text: payload.text,
  context: payload.context,
  classification: mlResult.classification,
  confidence: mlResult.confidence,
  toxicity_score: mlResult.analysis.toxicity.score,
  primary_emotion: mlResult.analysis.emotion.primary_emotion,
  detected_issues: mlResult.analysis.detected_issues,
  intent: mlResult.analysis.intent
};

await saveToDatabase(record);  // or appendToCSV(record)
```

### Step 3: Parent Dashboard Queries
```typescript
// Parent dashboard
const weeklyData = await queryDatabase({
  kidId: "kid_01",
  startDate: getWeekStart(),
  endDate: getWeekEnd()
});

// Aggregate
const stats = {
  kindInteractions: weeklyData.filter(d => d.classification === "green").length,
  riskMoments: weeklyData.filter(d => d.classification === "yellow").length,
  // ... etc
};
```

---

## 🎯 Key Takeaways

1. **ML Model Input**: Simple - just `message` and optional `age_range`
2. **ML Model Output**: Rich - `ProcessingResult` with classification, analysis, feedback
3. **Child Interface**: Uses output for real-time guardian feedback
4. **Parent Dashboard**: Needs aggregated data from stored results (not individual messages)
5. **Data Storage**: Store full results with `kidId` and `timestamp` for parent aggregation
6. **Privacy**: Parent dashboard shows **patterns and themes**, not exact messages

---

## 📚 Related Files

- **ML Model**: `backend/src/pipeline.py` (MessageProcessor)
- **API**: `backend/src/api/app.py` (FastAPI endpoints)
- **Data Models**: `backend/src/models.py` (ProcessingResult, etc.)
- **Child Interface**: `web/app/child/[kidId]/page.tsx`
- **Parent Dashboard**: `web/app/parent/insights/page.tsx`, `web/components/ParentSummaryPanel.tsx`

---

**Last Updated**: 2024-01-15  
**Version**: 1.0

