# Current Data Flow Analysis

## 📊 How the AI Agent Currently Gets Data for Jamie and Emma

### Current State: **Static, Manually Created Data**

The AI agent (parent chat) currently gets data from a **static CSV file** (`web/data/child_behaviour.csv`) that contains manually written summaries and statistics.

---

## 🔄 Current Data Flow

```
┌─────────────────────────────────────────────────────────┐
│  Static CSV: child_behaviour.csv                        │
│  - Manually written weekly summaries                   │
│  - Static stats (kindInteractions: 18, risks: 5)      │
│  - Pre-written positiveProgress and gentleFlags        │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│  behaviourData.ts                                       │
│  - Reads child_behaviour.csv                           │
│  - Parses into ParentBehaviourData                     │
│  - Returns cached data                                  │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│  /api/chat/route.ts                                     │
│  - Calls getParentBehaviourData()                       │
│  - Gets static child data                               │
│  - Passes to OpenAI GPT-4o-mini or fallback agent      │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│  AI Response                                            │
│  - Uses static weeklySummary, focusTheme, etc.         │
│  - Generates chat reply based on static data           │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 Data Sources

### 1. **Static Data (Currently Used)**
**File**: `web/data/child_behaviour.csv`

**Contents**:
- Manually written weekly summaries
- Static statistics (kind interactions, risks, privacy warnings)
- Pre-written positive progress and gentle flags
- Calendar day statuses

**Example**:
```csv
kid_01,Jamie,2024-09-02,"Jamie shared more kind notes...","Kind language",...
```

**Used By**:
- ✅ `behaviourData.ts` → `getParentBehaviourData()`
- ✅ `/api/chat/route.ts` → Passes to AI agent
- ✅ `/api/parent/summary/route.ts` → Returns to frontend
- ✅ `ParentSummaryPanel.tsx` → Displays stats
- ✅ `ParentChatPanel.tsx` → Shows in chat

---

### 2. **ML Classification Data (NOT Currently Used)**
**Files**: 
- `web/data/jamieClassification.csv` (471 records)
- `web/data/emmaClassification.csv` (477 records)

**Contents**:
- Real ML model classifications (green/yellow/red)
- Toxicity scores, emotions, intents
- Detected issues
- Timestamps for each message
- **This is REAL data from the ML model!**

**Example**:
```csv
id,timestamp,text,context,classification,confidence,toxicity_score,primary_emotion,intent,detected_issues
1,2024-01-16 08:57:08,fr thats so cool,message,green,0.9,0.0,joy,positive,
```

**Currently Used By**:
- ❌ **NOT USED** by the parent agent
- ❌ **NOT USED** for generating weekly summaries
- ❌ **NOT USED** for statistics
- ✅ Only exists as raw data files

---

## 🎯 The Gap

### What's Missing:

1. **No Aggregation**: The ML classification CSVs have 471+ records per child, but they're not being aggregated into weekly summaries or statistics.

2. **No Dynamic Data**: The parent agent uses static, manually written summaries instead of calculating them from real ML classifications.

3. **No Real-Time Updates**: The dashboard shows the same static data regardless of what children actually typed.

4. **Disconnected Systems**: 
   - Child interface → ML model → Classification CSVs ✅ (works)
   - Classification CSVs → Parent dashboard ❌ (broken link)

---

## 💡 What Needs to Happen

### To Improve the Model:

1. **Aggregate ML Classification Data**
   - Read from `jamieClassification.csv` and `emmaClassification.csv`
   - Calculate weekly statistics from real classifications
   - Generate summaries based on actual patterns

2. **Dynamic Statistics**
   - **Kind interactions**: Count of GREEN classifications
   - **Potential risks**: Count of YELLOW classifications  
   - **Privacy warnings**: Count of privacy-related detections
   - **Digital wellbeing**: Based on patterns (late-night usage, etc.)

3. **Real Weekly Summaries**
   - Analyze emotion trends (joy, anger, sadness)
   - Identify most common detected issues
   - Calculate focus themes from actual data
   - Generate positive progress and gentle flags from patterns

4. **Calendar Integration**
   - Calculate daily performance from classifications per day
   - Color-code days based on GREEN/YELLOW/RED ratios

---

## 🔧 Current Code Locations

### Where Data is Loaded:
- **`web/lib/behaviourData.ts`**: Reads `child_behaviour.csv`
- **`web/app/api/chat/route.ts`**: Uses `getParentBehaviourData()`
- **`web/lib/parentAgent.ts`**: Fallback agent using static data

### Where ML Data Exists (Unused):
- **`web/data/jamieClassification.csv`**: 471 records with ML classifications
- **`web/data/emmaClassification.csv`**: 477 records with ML classifications

---

## 📝 Summary

**Current State**: 
- ✅ ML model works and generates classifications
- ✅ Classifications are stored in CSV files
- ❌ Parent agent uses static, manually written data
- ❌ ML classifications are NOT used for parent dashboard

**To Improve**:
- Aggregate ML classification CSVs into dynamic statistics
- Generate weekly summaries from real patterns
- Connect ML data → Parent dashboard
- Make the AI agent responses based on actual analyzed behavior

---

**Next Steps**: We need to create an aggregation layer that:
1. Reads the classification CSVs
2. Calculates statistics (kind interactions, risks, etc.)
3. Generates weekly summaries from patterns
4. Updates the parent agent to use this aggregated data

