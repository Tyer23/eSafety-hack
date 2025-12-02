from flask import Flask, jsonify

app = Flask(__name__)

REPORT = {
    "weekly_summary": (
        "Overall tone is warmer with more supportive and polite messages. There were a few moments of strong language "
        "that were flagged for gentle follow-up; encouragement and humor are helping conversations stay calmer."
    ),
    # Added the structured metrics so other UIs (e.g., Streamlit) can render stats.
    "communication_trends": {
        "positive_interactions": {
            "current_week": 68,
            "previous_week": 55,
            "change": "+13",
            "notes": "Increase in supportive comments and polite responses."
        },
        "negative_interactions": {
            "current_week": 12,
            "previous_week": 18,
            "change": "-6",
            "notes": "Reduction in frustration-related messages."
        },
        "neutral_interactions": {
            "current_week": 40,
            "previous_week": 46,
            "change": "-6",
            "notes": "Slight decrease due to more expressive communication overall."
        }
    },
    "red_flags": [
        {
            "category": "Strong language",
            "count": 3,
            "examples": ["\"This is stupid\"", "\"Why don't you shut up\"", "\"I'm so pissed\""],
            "guidance": "Acknowledge feelings first, then invite a calmer rephrase. Keep it non-judgmental."
        },
        {
            "category": "Possible stranger contact",
            "count": 1,
            "examples": ["\"Some random DMed me\""],
            "guidance": "Stay curious, ask who it was, and remind them to keep chats to known friends."
        }
    ],
    "themes_detected": [
        {
            "theme": "Handling Criticism",
            "score_last_week": 2,
            "score_this_week": 4,
            "notes": "Child responded less defensively and used humor to de-escalate."
        },
        {
            "theme": "Offering Encouragement",
            "score_last_week": 3,
            "score_this_week": 5,
            "notes": "More praise given to peers; increase in uplifting language."
        },
        {
            "theme": "Expressing Stress",
            "score_last_week": 4,
            "score_this_week": 3,
            "notes": "Mild improvement — fewer stress indicators than previous week."
        }
    ],
    "ai_suggestions_followed": [
        {
            "suggestion": "Try responding with curiosity instead of reacting immediately.",
            "applied_times": 6,
            "impact": "Reduced escalation in group chats."
        },
        {
            "suggestion": "Send one positive message per day to a friend.",
            "applied_times": 4,
            "impact": "Increase in positive interactions."
        }
    ],
    "trend_analysis": {
        "positive_interactions": "Improving (+13 vs last week) with more supportive and polite responses.",
        "negative_interactions": "Declining (-6) as frustration-related messages decreased.",
        "neutral_interactions": "Slightly down (-6) because the child is expressing more feelings instead of staying neutral."
    },
    "behaviour_themes": [
        "Handling Criticism: improved from 2 to 4; using humor to de-escalate.",
        "Offering Encouragement: improved from 3 to 5; more praise and uplifting language.",
        "Expressing Stress: easing from 4 to 3; fewer stress indicators."
    ],
    "positive_progress": [
        "More supportive comments and polite responses.",
        "Uses humor to soften criticism moments.",
        "Regular praise to friends, matching the daily positive message habit.",
        "Less escalation in group chats when responding with curiosity."
    ],
    "gentle_flags": [
        "Stress signals are lower but still present; keep checking in calmly."
    ],
    "recommended_parent_scripts": [
        "“I noticed you’re using humor when conversations get tense—how does that feel for you?”",
        "“You’ve been really encouraging to friends lately. What sparked that?”",
        "“When things feel stressful online, what helps you take a breath before replying?”",
        "“Trying curiosity before reacting seems to help. Want to share a time it worked?”"
    ],
    "suggested_next_steps": [
        "Keep the one-positive-message-a-day habit; celebrate small wins together.",
        "Agree on a simple pause strategy (deep breath or short break) when chats feel tense.",
        "Invite them to share one weekly story where curiosity helped prevent an argument.",
        "Check in on stress signs gently—ask if they want ideas for quick resets."
    ]
}

@app.get("/weekly-report")
def weekly_report():
    return jsonify(REPORT)

if __name__ == "__main__":
    app.run(debug=True, port=8000)
