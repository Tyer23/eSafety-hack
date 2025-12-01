import streamlit as st
import json
import os

# Paths for json files
base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
user_file = os.path.join(base_dir, "users.json")
word_file = os.path.join(base_dir, "words.json")

# Load list of words from words.json
def load_words():
    try:
        with open(word_file, "r") as f:
            return json.load(f)
    except FileNotFoundError:
        return {}

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

    # Chatbot section
    st.subheader("Chatbot")
    if "messages" not in st.session_state:
        st.session_state.messages = []

    question = st.text_input("Type here...", key="chat_input")

    if st.button("Send", key="send"):
        if question:
            # Add user message
            st.session_state.messages.append(("user", question))

    # Display chat messages
    for sender, message in st.session_state.messages:
        if sender == "user":
            st.markdown(f"**You:** {message}")
        else:
            st.markdown(f"**Bot:** {message}")

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
