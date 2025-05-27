import streamlit as st
from utils.agent_interface import query_lyzr_agent
from config import Config

st.title("💬 JustiChat - Legal Chatbot")

# Initialize chat history
if "justichat_messages" not in st.session_state:
    st.session_state.justichat_messages = []

# Display chat messages from history on app rerun
for message in st.session_state.justichat_messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# React to user input
if prompt := st.chat_input("Ask a legal question"):
    # Display user message in chat message container
    st.chat_message("user").markdown(prompt)
    # Add user message to chat history
    st.session_state.justichat_messages.append(
        {"role": "user", "content": prompt})

    # Get assistant response
    response = query_lyzr_agent(
        prompt, agent_id=Config.JUSTICHAT_AGENT_ID, session_id=Config.JUSTICHAT_SESSION_ID
    )
    # Display assistant response in chat message container
    with st.chat_message("assistant"):
        st.markdown(response)
    # Add assistant response to chat history
    st.session_state.justichat_messages.append(
        {"role": "assistant", "content": response})
