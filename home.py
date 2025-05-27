import streamlit as st
from utils.auth import authenticate_user

st.set_page_config(page_title="Legal Assistant Hub", layout="wide")

# Authentication
if 'authenticated' not in st.session_state:
    st.session_state['authenticated'] = False

if not st.session_state['authenticated']:
    username = st.text_input("Username")
    password = st.text_input("Password", type="password")
    if st.button("Login"):
        if authenticate_user(username, password):
            st.session_state['authenticated'] = True
            st.session_state['username'] = username
            st.rerun()

        else:
            st.error("Invalid credentials")
    st.stop()

# Sidebar
# render_sidebar()

st.title("📚 Welcome to Legal Assistant Hub")
st.markdown("Navigate to a legal AI agent from the sidebar to begin.")
