# Legal Assistant Hub

A Streamlit-based suite of AI-powered legal tools for document generation, classification, summarization, and legal Q&A, leveraging Lyzr AI agents.

## Features

- **DocForge**: Generate legal document templates and download as PDF.
- **DocSort**: Classify uploaded legal documents.
- **JustiChat**: Chatbot for legal questions and answers.
- **LawLumen**: Explain legal terms and text.
- **LexBrief**: Summarize long case files.
- **PrecedentPro**: Retrieve legal precedents (see config for agent IDs).

## Project Structure

```
.
├── .env
├── config.py
├── home.py
├── agent/
├── assets/
├── pages/
│   ├── 01_DocForge.py
│   ├── 02_JustiChat.py
│   ├── 04_DocSort.py
│   ├── 05_LawLumen.py
│   ├── 06_LexBrief.py
│   └── ...
├── utils/
│   ├── agent_interface.py
│   ├── file_extractor.py
│   ├── pdf_generator.py
│   └── ...
└── ...
```

## Setup

1. **Clone the repository**
   ```sh
   git clone https://github.com/PaushigaaGoML/Agent-Builder-League.git
   cd Agent\ Builder\ League
   ```

2. **Create and activate a virtual environment**
   ```sh
   python3 -m venv agent
   source agent/bin/activate
   ```

3. **Install dependencies**
   ```sh
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   - Copy `.env.example` to `.env` (if provided) or edit `.env` directly.
   - Copy `config_example.py` to `config.py` (if provided) or edit `config.py` directly.
   - Ensure all API keys and agent/session IDs are set.

5. **Run the app**
   ```sh
   streamlit run home.py
   ```

## Configuration

All agent and session IDs, as well as API keys, are managed in [`config.py`](config.py) and [`.env`](.env).  
Update these files with your credentials as needed.

## Usage

- Access the app in your browser at `http://localhost:8501`.
- Navigate between tools using the sidebar or page navigation.

## Dependencies

- Python 3.8+
- Streamlit
- (Other dependencies as listed in `requirements.txt`)

## License

See individual font licenses in [`assets`](assets).  

---

**Note:**  
This project uses Lyzr AI agents. Ensure you have valid API access and agent/session IDs.

---

For more details, see the code for each tool in the [`pages`](pages) directory.  
Configuration is centralized in [`config.py`](config.py).  
Utility functions are in [`utils`](utils).
