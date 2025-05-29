from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from config import Config
from utils.agent_interface import query_lyzr_agent
from utils.pdf_generator import generate_pdf
from utils.file_extractor import extract_text_from_pdf

app = FastAPI(title="Legal Assistant Hub API")

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request models


class TextRequest(BaseModel):
    text: str


class ChatRequest(BaseModel):
    message: str

# 1. DocForge - Generate legal document template and download as PDF


@app.post("/docforge")
async def docforge(doc_type: str = Form(...)):
    """
    Accepts a document type as text, returns a generated template as downloadable PDF.
    """
    try:
        result = query_lyzr_agent(
            doc_type,
            agent_id=Config.DOC_FORGE_AGENT_ID,
            session_id=Config.DOC_FORGE_SESSION_ID
        )
        pdf_buffer = generate_pdf(text=result, title=doc_type)
        pdf_buffer.seek(0)
        return StreamingResponse(
            pdf_buffer,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={doc_type}.pdf"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 2. DocSort - Classify uploaded legal document (PDF)


@app.post("/docsort")
async def docsort(file: UploadFile = File(...)):
    """
    Accepts a PDF file, extracts text, and returns the classification.
    """
    try:
        file_bytes = await file.read()
        # Use extract_text_from_pdf logic (expects a file-like object)
        from io import BytesIO
        text = extract_text_from_pdf(BytesIO(file_bytes))
        result = query_lyzr_agent(
            text,
            agent_id=Config.DOC_SORT_AGENT_ID,
            session_id=Config.DOC_SORT_SESSION_ID
        )
        return {"classification": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 3. JustiChat - Legal Q&A chatbot


@app.post("/justichat")
async def justichat(req: ChatRequest):
    """
    Accepts a message, returns the chatbot's answer.
    """
    try:
        result = query_lyzr_agent(
            req.message,
            agent_id=Config.JUSTICHAT_AGENT_ID,
            session_id=Config.JUSTICHAT_SESSION_ID
        )
        return {"answer": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 4. LawLumen - Explain legal terms/text


@app.post("/lawlumen")
async def lawlumen(req: TextRequest):
    """
    Accepts text, returns explanation of legal terms.
    """
    try:
        result = query_lyzr_agent(
            req.text,
            agent_id=Config.LAW_LUMEN_AGENT_ID,
            session_id=Config.LAW_LUMEN_SESSION_ID
        )
        return {"explanation": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 5. LexBrief - Summarize long case files (PDF)


@app.post("/lexbrief")
async def lexbrief(file: UploadFile = File(...)):
    """
    Accepts a PDF file, extracts text, and returns a summary.
    """
    try:
        file_bytes = await file.read()
        from io import BytesIO
        text = extract_text_from_pdf(BytesIO(file_bytes))
        result = query_lyzr_agent(
            text,
            agent_id=Config.LEX_BRIEF_AGENT_ID,
            session_id=Config.LEX_BRIEF_SESSION_ID
        )
        return {"summary": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 6. PrecedentPro - Retrieve legal precedents (text)


@app.post("/precedentpro")
async def precedentpro(req: TextRequest):
    """
    Accepts case facts as text, returns relevant precedents.
    """
    try:
        result = query_lyzr_agent(
            req.text,
            agent_id=Config.PRECENDENT_PRO_AGENT_ID,
            session_id=Config.PRECENDENT_PRO_SESSION_ID
        )
        return {"precedents": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
