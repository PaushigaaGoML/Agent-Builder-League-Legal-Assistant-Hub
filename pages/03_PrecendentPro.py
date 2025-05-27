import streamlit as st
from utils.agent_interface import query_lyzr_agent
from config import Config

# Check authentication before showing content
if not st.session_state.get('authenticated', False):
    st.warning("Please log in to access this page.")
    st.stop()

st.title("🔍 PrecendentPro - Case Law Finder")

facts = st.text_area("Enter the case facts")
if st.button("Find Precedents") and facts:
    response = query_lyzr_agent(
        facts, agent_id=Config.PRECENDENT_PRO_AGENT_ID, session_id=Config.PRECENDENT_PRO_SESSION_ID
    )
    st.markdown(response)
