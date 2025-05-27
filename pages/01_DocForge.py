import streamlit as st
from utils.agent_interface import query_lyzr_agent
from config import Config
from utils.pdf_generator import generate_pdf
import json

# Check authentication before showing content
if not st.session_state.get('authenticated', False):
    st.warning("Please log in to access this page.")
    st.stop()

st.title("📄 DocForge - Legal Document Generator")

doc_type = st.text_input(
    "Enter the type of legal document (e.g., Legal Notice, Affidavit)")
if st.button("Generate Template") and doc_type:
    with st.spinner("Generating..."):
        if doc_type not in st.session_state:
            result_text = query_lyzr_agent(
                doc_type, agent_id=Config.DOC_FORGE_AGENT_ID, session_id=Config.DOC_FORGE_SESSION_ID
            )
            st.session_state[doc_type] = result_text
        else:
            result_text = st.session_state[doc_type]

        # Generate PDF from the result text
        buffer = generate_pdf(text=result_text, title=doc_type)
        st.download_button(
            label="Download as PDF",
            data=buffer,
            file_name=f"{doc_type}.pdf",
            mime="application/pdf"
        )
