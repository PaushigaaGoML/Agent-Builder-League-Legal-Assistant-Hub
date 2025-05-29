# Legal Assistant Hub

A suite of AI-powered legal tools for document generation, classification, summarization, and legal Q&A, leveraging Lyzr AI agents.

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
├── .env.example
├── .gitignore
├── api.py
├── bun.lockb
├── components.json
├── config.py
├── config_example.py
├── eslint.config.js
├── home.py
├── index.html
├── package.json
├── postcss.config.js
├── README.md
├── requirements.txt
├── tailwind.config.ts
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── __pycache__/
│   ├── api.cpython-312.pyc
│   └── config.cpython-312.pyc
├── agent/
│   ├── bin/
│   ├── etc/
│   ├── include/
│   ├── lib/
│   ├── lib64/
│   ├── pip.conf
│   ├── pyvenv.cfg
│   └── share/
├── assets/
│   ├── DejaVu Fonts License.txt
│   ├── DejaVuSans-Bold.pkl
│   └── ...
├── pages/
│   ├── 01_DocForge.py
│   ├── 02_JustiChat.py
│   ├── 04_DocSort.py
│   ├── 05_LawLumen.py
│   ├── 06_LexBrief.py
│   └── ...
├── public/
│   └── ...
├── src/
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   ├── vite-env.d.ts
│   ├── components/
│   │   ├── Dashboard.tsx
│   │   ├── features/
│   │   │   ├── DocForge.tsx
│   │   │   ├── LexBrief.tsx
│   │   │   ├── PrecedentPro.tsx
│   │   │   └── ...
│   │   └── ui/
│   │       ├── aspect-ratio.tsx
│   │       ├── breadcrumb.tsx
│   │       ├── button.tsx
│   │       ├── calendar.tsx
│   │       ├── carousel.tsx
│   │       ├── chart.tsx
│   │       ├── command.tsx
│   │       ├── dialog.tsx
│   │       ├── drawer.tsx
│   │       ├── form.tsx
│   │       ├── navigation-menu.tsx
│   │       ├── pagination.tsx
│   │       ├── progress.tsx
│   │       ├── scroll-area.tsx
│   │       ├── separator.tsx
│   │       ├── sheet.tsx
│   │       ├── sidebar.tsx
│   │       ├── skeleton.tsx
│   │       ├── slider.tsx
│   │       ├── switch.tsx
│   │       ├── toaster.tsx
│   │       ├── tooltip.tsx
│   │       └── ...
│   ├── lib/
│   │   └── utils.ts
│   └── pages/
│       ├── Index.tsx
│       ├── NotFound.tsx
│       └── ...
├── utils/
│   ├── agent_interface.py
│   ├── file_extractor.py
│   ├── pdf_generator.py
│   └── ...
```

## Setup

### Run FastAPI

1. **Clone the repository**
   ```sh
   git clone https://github.com/PaushigaaGoML/Agent-Builder-League-Legal-Assistant-Hub.git
   cd Agent-Builder-League-Legal-Assistant-Hub
   ```

2. **Create and activate a virtual environment**
In a new terminal,
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

5. **Run the fastapi app**
   ```sh
   uvicorn api:app --reload
   ```

### Run WebApp
1. **Install Packages**
In a new terminal run, 
    ```sh
    npm i
    npm install axios
    ```

2. **Run the WebApp**
    ```sh
    npm run dev
    ```

Make sure the fastapi is running in an ideal terminal

## Configuration

All agent and session IDs, as well as API keys, are managed in [`config.py`](config.py) and [`.env`](.env).  
Update these files with your credentials as needed.

## Usage

- Access the Fastapi app in your browser at `http://localhost:8000`.
- Access the react web app in your browser at `http://localhost:8080`
- Navigate between sections to test the features

## Dependencies

- Python 3.8+
- (Other dependencies as listed in `requirements.txt`)

## License

See individual font licenses in [`assets`](assets).  
Project code: [Add your license here].

---

**Note:**  
This project uses Lyzr AI agents. Ensure you have valid API access and agent/session IDs.

---

For more details, see the code for each tool in the [`pages`](pages) directory.  
Configuration is centralized in [`config.py`](config.py).  
Utility functions are in [`utils`](utils).

## What technologies are used for this project?

This project is built with:

- Lyzr Agent Studio
- FastAPI
- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS