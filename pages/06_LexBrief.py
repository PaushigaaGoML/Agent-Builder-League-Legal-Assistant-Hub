import streamlit as st
from utils.agent_interface import query_lyzr_agent
from utils.file_extractor import extract_text_from_pdf
from config import Config

# Check authentication before showing content
if not st.session_state.get('authenticated', False):
    st.warning("Please log in to access this page.")
    st.stop()

st.title("🧾 LexBrief - Case File Summarizer")

uploaded_file = st.file_uploader("Upload a long case file")
if uploaded_file:
    text = extract_text_from_pdf(uploaded_file)
    if st.button("Summarize"):
        summary = query_lyzr_agent(
            text, agent_id=Config.LEX_BRIEF_AGENT_ID, session_id=Config.LEX_BRIEF_SESSION_ID)
        st.markdown(summary)
