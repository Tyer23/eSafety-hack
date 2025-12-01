import streamlit as st
import json
import os

# Load users.json file 
base_dir = os.path.abspath(os.path.dirname(__file__))
user_file = os.path.join(base_dir, "users.json")

def load_users():
    with open(user_file, "r") as f:
        return json.load(f)

def login():
    st.title("Login Page")

    # Parent/Child Selection
    role = st.radio("Login as:", ["Parent", "Child"])

    st.write("Enter your login details")

    username = st.text_input("Username")
    password = st.text_input("Password", type="password")

    # Login Button 
    if st.button("Log In"):
        users = load_users()

        if username in users:
            if users[username]["password"] == password and users[username]["role"] == role.lower():
                st.session_state["user"] = username
                st.session_state["role"] = role.lower()

                # Redirect logic
                if role.lower() == "parent":
                   st.switch_page("pages/parent_page.py")   
                else:
                   st.switch_page("pages/child_page.py")    

            else:
                st.error("Incorrect username or password. Please try again!")
        else:
            st.error("User not found. Please sign in!")


