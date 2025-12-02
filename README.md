***UI FOR PARENT-CHILD EDUCATOR, INCLUDING PARENT DASHBOARD***

1. WHAT THIS DOES:
A Streamlit-based web app for parents and their children, including parent dashboard for viewing their kids' words and educating them as well as a child dashboard.

2. SET UP:
*Clone the repository
git clone https://github.com/Tyer23/eSafety-hack.git
cd eSafety-hack

*(Optional) Create a virtual environment
python -m venv venv
venv\Scripts\activate   # Windows

*Install dependencies
pip install -r requirements.txt

*Run the app
streamlit run app.py

3. Key Files/Folders:
-app.py – Main entry point that launches the app.
-users.json – Stores parent/child login accounts.
-words.json – Stores children’s word lists.
-login.py – Login page for parent or child.
-/pages/parent_page.py – Parent dashboard (dashboard, chatbot, view word list).
-/pages/child_page.py – Child dashboard.

4. Common Commands
-git add .           # Stage changes
-git commit -m ""    # Commit changes
-git push            # Push to GitHub
-streamlit run app.py   # Start the app
-pip install streamlit  # Install Streamlit

5. Questions/Issues:
Feel free to reach on our group chat MLTPY or quocco(tyler) on Discord.
