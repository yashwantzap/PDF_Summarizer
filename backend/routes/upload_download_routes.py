import os
import json
import sqlite3
from flask import Blueprint, request, jsonify, current_app, send_file
from werkzeug.utils import secure_filename
from core.secure_storage import encrypt_bytes, decrypt_bytes
from core.structured_extraction import extract_structured_data
from core.extractor import extract_text_from_pdf
from core.summarizer import summarize_text
from core.translator import translate_to_english

upload_bp = Blueprint('upload_bp', __name__)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # root PDF_Summarizer
DB_PATH = os.path.join(BASE_DIR, 'filemeta.db')
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
SUMMARY_DIR = os.path.join(BASE_DIR, 'summaries')

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(SUMMARY_DIR, exist_ok=True)

def init_db():
    with sqlite3.connect(DB_PATH) as conn:
        c = conn.cursor()
        c.execute("""
            CREATE TABLE IF NOT EXISTS files (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                filename TEXT,
                enc_filename TEXT,
                case_number TEXT,
                client_name TEXT,
                upload_date TEXT
            )
        """)
init_db()

ALLOWED_EXTENSIONS = {'pdf', 'docx', 'jpg', 'jpeg', 'png'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def validate_file(file):
    if not allowed_file(file.filename):
        return f"Unsupported file type: {file.filename}"
    file.seek(0, os.SEEK_END)
    size = file.tell()
    file.seek(0)
    if size > MAX_FILE_SIZE:
        return f"File too large: {file.filename}"
    return None

@upload_bp.route('/secure-upload', methods=['POST'])
def secure_upload():
    files = request.files.getlist('documents')
    case_number = request.form.get('case_number', '').strip()
    client_name = request.form.get('client_name', '').strip()
    upload_date = request.form.get('upload_date', '').strip()

    if not files:
        return jsonify({"error": "No files uploaded"}), 400

    responses = []
    errors = []

    for file in files:
        err = validate_file(file)
        if err:
            errors.append(err)
            continue

        file_bytes = file.read()
        enc_bytes = encrypt_bytes(file_bytes)

        if case_number:
            safe_case_number = "".join([c for c in case_number if c.isalnum() or c in ('-', '_')]).strip()
            enc_filename = f"{safe_case_number}.aes"
        else:
            orig_name = secure_filename(file.filename).rsplit('.', 1)[0]
            safe_case_number = orig_name
            enc_filename = f"{orig_name}.aes"

        save_path = os.path.join(UPLOAD_FOLDER, enc_filename)
        with open(save_path, "wb") as f:
            f.write(enc_bytes)

        with sqlite3.connect(DB_PATH) as conn:
            c = conn.cursor()
            c.execute(
                "INSERT INTO files (filename, enc_filename, case_number, client_name, upload_date) VALUES (?, ?, ?, ?, ?)",
                (file.filename, enc_filename, case_number, client_name, upload_date)
            )
            conn.commit()

        temp_decrypted_path = os.path.join(UPLOAD_FOLDER, f"temp_{file.filename}")
        with open(temp_decrypted_path, "wb") as temp_file:
            temp_file.write(file_bytes)

        extracted_text = extract_text_from_pdf(temp_decrypted_path)

        # Translate to English for unified processing
        translated_text = translate_to_english(extracted_text)

        structured_data = extract_structured_data(translated_text)
        summary = summarize_text(translated_text)

        os.remove(temp_decrypted_path)

        combined_data = {
            "structured_data": structured_data,
            "summary": summary
        }

        summary_file_path = os.path.join(SUMMARY_DIR, f"{safe_case_number}_summary.json")
        with open(summary_file_path, "w", encoding="utf-8") as jf:
            json.dump(combined_data, jf, indent=4, ensure_ascii=False)

        responses.append({
            "filename": file.filename,
            "encrypted_file": enc_filename,
            "structured_data": structured_data,
            "summary": summary,
            "summary_file_url": f"/download-summary/{safe_case_number}"
        })

    status = "success" if not errors else "partial"
    return jsonify({"status": status, "uploaded": responses, "errors": errors})

@upload_bp.route('/secure-download/<enc_filename>', methods=['GET'])
def secure_download(enc_filename):
    file_path = os.path.join(UPLOAD_FOLDER, enc_filename)
    if not os.path.exists(file_path):
        return jsonify({"error": "File not found"}), 404

    with open(file_path, "rb") as f:
        encrypted_data = f.read()
    decrypted_data = decrypt_bytes(encrypted_data)
    orig_filename = enc_filename[:-4]

    return (
        decrypted_data,
        200,
        {
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': f'attachment; filename="{orig_filename}"'
        }
    )

@upload_bp.route('/secure-metadata-search', methods=['GET'])
def secure_metadata_search():
    case_number = request.args.get('case_number', '').strip().lower()
    client_name = request.args.get('client_name', '').strip().lower()
    upload_date = request.args.get('upload_date', '').strip()

    query = "SELECT filename, enc_filename, case_number, client_name, upload_date FROM files WHERE 1=1"
    params = []

    if case_number:
        query += " AND lower(case_number) LIKE ?"
        params.append(f"%{case_number}%")
    if client_name:
        query += " AND lower(client_name) LIKE ?"
        params.append(f"%{client_name}%")
    if upload_date:
        query += " AND upload_date = ?"
        params.append(upload_date)

    with sqlite3.connect(DB_PATH) as conn:
        c = conn.cursor()
        c.execute(query, tuple(params))
        rows = c.fetchall()

    results = [{
        "filename": row[0],
        "encrypted_file": row[1],
        "case_number": row[2],
        "client_name": row[3],
        "upload_date": row[4]
    } for row in rows]

    return jsonify({"results": results})

@upload_bp.route('/download-summary/<case_number>', methods=['GET'])
def download_summary(case_number):
    safe_case_number = "".join([c for c in case_number if c.isalnum() or c in ('-', '_')]).strip()
    summary_file = os.path.join(SUMMARY_DIR, f"{safe_case_number}_summary.json")

    if not os.path.exists(summary_file):
        return jsonify({"error": "Summary not found"}), 404

    return send_file(summary_file, as_attachment=True, download_name=f"{safe_case_number}_summary.json", mimetype='application/json')
