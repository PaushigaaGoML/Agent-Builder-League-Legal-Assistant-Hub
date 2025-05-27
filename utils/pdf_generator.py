from fpdf import FPDF
import io
import os


def generate_pdf(text: str, title: str = None, font_dir: str = "assets") -> io.BytesIO:
    pdf = FPDF()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=15)

    # Register full DejaVu font family
    font_name = "DejaVuSans"
    pdf.add_font(font_name, "", os.path.join(
        font_dir, "DejaVuSans.ttf"), uni=True)
    pdf.add_font(font_name, "B", os.path.join(
        font_dir, "DejaVuSans-Bold.ttf"), uni=True)
    pdf.add_font(font_name, "I", os.path.join(
        font_dir, "DejaVuSans-Oblique.ttf"), uni=True)
    pdf.add_font(font_name, "BI", os.path.join(
        font_dir, "DejaVuSans-BoldOblique.ttf"), uni=True)

    if title:
        pdf.set_font(font_name, style="B", size=14)
        pdf.cell(0, 10, title, ln=True, align='C')
        pdf.ln(10)

    pdf.set_font(font_name, size=12)
    pdf.multi_cell(0, 10, text)

    # Get PDF data as bytes
    pdf_bytes = pdf.output(dest='S').encode('latin-1')
    buffer = io.BytesIO(pdf_bytes)
    return buffer
