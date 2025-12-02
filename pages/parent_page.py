import json
import os
import textwrap
from typing import Dict, List, Tuple

import streamlit as st
from dotenv import load_dotenv

try:
    import openai
except ImportError:
    openai = None

from report_backend import REPORT

# Paths for json files
base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
word_file = os.path.join(base_dir, "words.json")

load_dotenv()


# Ensure OpenAI key is available from env or Streamlit secrets, matching streamlit_app behavior.
def ensure_openai_key():
    if openai is None:
        return
    key = os.environ.get("OPENAI_API_KEY")
    if not key:
        try:
            key = st.secrets.get("OPENAI_API_KEY")  # type: ignore[attr-defined]
        except Exception:
            key = None
    if key:
        os.environ.setdefault("OPENAI_API_KEY", key)


# Load list of words from words.json
def load_words():
    try:
        with open(word_file, "r") as f:
            return json.load(f)
    except FileNotFoundError:
        return {}


# Light-weight safety scan for red-flag content (violence, strangers, sexual content, strong profanity).
RED_FLAG_KEYWORDS = {
    "violence": ["fight", "kill", "hurt", "attack", "weapon"],
    "stranger": ["stranger", "unknown person", "random dm", "met online", "new friend online"],
    "sexual": ["sex", "sexual", "nude", "explicit", "nsfw"],
    "profanity": ["fuck", "shit", "bitch", "damn"],
}


def detect_flags(message: str) -> List[str]:
    found = []
    lower = message.lower()
    for tag, words in RED_FLAG_KEYWORDS.items():
        if any(w in lower for w in words):
            found.append(tag)
    return found


def build_reply(prompt: str, report: Dict) -> str:
    """Rule-based fallback that grounds responses in the report data."""
    text = prompt.lower()
    lines = []

    if "stress" in text:
        lines.append("Stress signals are easing (score 4 ➜ 3). A calm check-in and a simple pause strategy can keep this trend going.")
    if "encourag" in text or "praise" in text:
        lines.append("Offering encouragement is rising (3 ➜ 5). Keep noticing their praise to friends and celebrate that habit.")
    if "criticism" in text or "tense" in text or "argument" in text:
        lines.append("Handling criticism improved (2 ➜ 4) with humor and curiosity. Remind them that taking a breath before replying keeps chats calm.")

    if not lines:
        lines.append("Overall tone is warmer: more supportive messages (+13) and fewer frustration moments (-6). Let your child know you see their effort.")

    lines.append("Two gentle scripts you can try:")
    for script in report.get("recommended_parent_scripts", [])[:2]:
        lines.append(f"- {script}")

    lines.append("There were a few strong-language moments; acknowledge feelings first and invite softer words.")
    lines.append("A simple next step: invite one weekly story where curiosity helped, and keep the one-positive-message habit.")

    return "\n".join(lines)


def ai_reply(prompt: str, history: List[Dict[str, str]], report: Dict) -> Tuple[str, bool]:
    """Use ChatGPT if available, otherwise fall back to rule-based reply."""
    if openai is None or not os.environ.get("OPENAI_API_KEY"):
        return build_reply(prompt, report), False

    system_prompt = (
        "You are KindNet-Parent-AI, a supportive assistant for parents. "
        "Use only the provided structured report data to ground suggestions. "
        "Stay calm, non-judgmental, and supportive. Avoid alarming language."
    )

    messages = [{"role": "system", "content": system_prompt}]
    for m in history[-6:]:
        messages.append({"role": m["role"], "content": m["content"]})
    messages.append({"role": "user", "content": prompt})
    messages.append({"role": "system", "content": f"Weekly report data: {report}"})

    try:
        client = openai.OpenAI()
        resp = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            temperature=0.2,
        )
        return resp.choices[0].message.content, True
    except Exception:
        return build_reply(prompt, report), False


# Parent Page
def parent_dashboard():
    # Log out the account
    if st.button("Log Out"):
        for key in list(st.session_state.keys()):
            del st.session_state[key]
        st.stop()

    # Check if user is logged in as a parent or isn't logged in yet
    if "user" not in st.session_state or st.session_state.get("role") != "parent":
        st.error("You must log in as a parent to view the page.")
        st.stop()

    ensure_openai_key()

    st.title("Parent Dashboard")

    report = REPORT

    # Headline stats
    comm = report.get("communication_trends", {})
    pos = comm.get("positive_interactions", {})
    neg = comm.get("negative_interactions", {})
    neu = comm.get("neutral_interactions", {})

    col1, col2, col3 = st.columns(3)
    if pos and neg and neu:
        col1.metric("Positive interactions", f"{pos.get('current_week', '-')}", pos.get("change", ""))
        col2.metric("Negative interactions", f"{neg.get('current_week', '-')}", neg.get("change", ""))
        col3.metric("Neutral interactions", f"{neu.get('current_week', '-')}", neu.get("change", ""))
    else:
        ta = report.get("trend_analysis", {})
        col1.write(ta.get("positive_interactions", "Positive interactions: n/a"))
        col2.write(ta.get("negative_interactions", "Negative interactions: n/a"))
        col3.write(ta.get("neutral_interactions", "Neutral interactions: n/a"))

    st.subheader("Weekly summary")
    st.write(report.get("weekly_summary", "No summary available."))

    with st.expander("Themes and notes", expanded=True):
        for theme in report.get("themes_detected", []):
            st.markdown(f"**{theme['theme']}** — {theme['notes']} (score {theme['score_last_week']} ➜ {theme['score_this_week']})")

    with st.expander("Parent scripts you can use"):
        for script in report.get("recommended_parent_scripts", []):
            st.markdown(f"- {script}")

    with st.expander("Suggested next steps"):
        for step in report.get("suggested_next_steps", []):
            st.markdown(f"- {step}")

    with st.expander("Flagged items (gentle follow-up)", expanded=True):
        red_flags = report.get("red_flags", [])
        if not red_flags:
            st.write("No sensitive items were flagged this week.")
        for flag in red_flags:
            examples = ", ".join(flag.get("examples", []))
            st.markdown(f"**{flag['category']}** — {flag['count']} instance(s).")
            if examples:
                st.markdown(f"_Examples:_ {examples}")
            if flag.get("guidance"):
                st.markdown(f"_Guidance:_ {flag['guidance']}")

    # Chatbot section
    st.subheader("Chatbot")
    if "messages" not in st.session_state:
        st.session_state.messages = [
            {
                "role": "assistant",
                "content": textwrap.dedent(
                    """
                    Hi! This space shares the weekly KindNet insights, including a few strong-language moments flagged for gentle follow-up. Ask about stress, encouragement, or how to respond, and I will offer calm, data-based ideas.
                    """
                ).strip(),
            }
        ]

    for msg in st.session_state.messages:
        with st.chat_message(msg["role"]):
            st.write(msg["content"])

    prompt = st.chat_input("Ask about this week's online tone, stress, or ways to respond")
    if prompt:
        st.session_state.messages.append({"role": "user", "content": prompt})
        with st.chat_message("user"):
            st.write(prompt)

        flags = detect_flags(prompt)
        if flags:
            st.info(
                "Your question mentions sensitive topics (e.g., stranger contact, violence, sexual content, strong language). "
                "The flagged items in this week's report are listed above; let's approach them calmly and supportively."
            )

        reply, used_ai = ai_reply(prompt, st.session_state.messages, report)
        st.session_state.messages.append({"role": "assistant", "content": reply})
        with st.chat_message("assistant"):
            st.write(reply)

        if used_ai:
            st.caption("Reply generated with ChatGPT, grounded in this week's report.")
        else:
            st.caption("Reply generated with on-page guidance (no external AI call).")

    st.divider()

    # Topics of Discussion
    st.subheader("Topics of Discussion")
    topics = ["New words", "How to educate kids", "How to familiarise with the page"]
    selected_topic = st.selectbox("Select a topic", topics)
    st.write(f"You selected: **{selected_topic}**")

    # View list of words
    st.subheader("List of words")
    words_data = load_words()
    if words_data:
        child = st.selectbox("Select a child", list(words_data.keys()))
        st.write(f"Words for {child}:")
        st.write(words_data[child])
    else:
        st.info("No words found.")


if __name__ == "__main__":
    parent_dashboard()
