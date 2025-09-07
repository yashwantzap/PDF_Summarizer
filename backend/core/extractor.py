import io
import re
import fitz
import pytesseract
from PIL import Image

# Set your Tesseract executable path as per your installation
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

# Add a list of languages (English, Hindi, Telugu)
OCR_LANGUAGES = 'eng+hin+tel'  # Assuming Tesseract trained data for hin and tel are installed

def clean_text(text: str) -> str:
    text = re.sub(r'\s+', ' ', text)
    text = ''.join(ch for ch in text if ch.isprintable())
    return text.strip()


def extract_text_from_pdf(file_path: str) -> str:
    text = ""
    try:
        doc = fitz.open(file_path)
        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            page_text = page.get_text().strip()
            if len(page_text) > 10:
                text += page_text + "\n"
            else:
                pix = page.get_pixmap(dpi=300)
                img = Image.open(io.BytesIO(pix.tobytes()))
                # Use Tesseract OCR with multi-language support
                ocr_text = pytesseract.image_to_string(img, lang=OCR_LANGUAGES)
                text += ocr_text + "\n"
    except Exception as e:
        text = f"Error extracting text: {str(e)}"
    return text
