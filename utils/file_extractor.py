from PyPDF2 import PdfReader
from io import BytesIO


def extract_text_from_pdf(uploaded_file):
    """
    Extracts text from a raw uploaded PDF file using PyPDF2.

    Parameters:
        uploaded_file (UploadedFile): A Streamlit UploadedFile object.

    Returns:
        str: Extracted text from the PDF.
    """
    if uploaded_file is not None:
        pdf_reader = PdfReader(BytesIO(uploaded_file.read()))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() or ""
        return text
    return ""
