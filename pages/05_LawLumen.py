import streamlit as st
from utils.agent_interface import query_lyzr_agent
from config import Config

# Check authentication before showing content
if not st.session_state.get('authenticated', False):
    st.warning("Please log in to access this page.")
    st.stop()

st.title("💡 LawLumen - Legal Term Explainer")

text = st.text_area("Paste text or legal terms for explanation")
if st.button("Explain Terms") and text:
    explanation = query_lyzr_agent(
        text, agent_id=Config.LAW_LUMEN_AGENT_ID, session_id=Config.LAW_LUMEN_SESSION_ID)
    st.markdown(explanation)
