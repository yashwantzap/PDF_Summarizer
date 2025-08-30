import os
import json
from flask import Blueprint, request, jsonify, current_app, send_from_directory
from werkzeug.utils import secure_filename
from core.extractor import extract_text_from_pdf
from core.summarizer import summarize_text

upload_bp = Blueprint('upload_bp', __name__)

@upload_bp.route('/upload', methods=['POST'])
def upload_pdf():
    files = request.files.getlist('documents')
    results = []

    for file in files:
        filename = secure_filename(file.filename)
        upload_folder = current_app.config['UPLOAD_FOLDER']
        if not os.path.exists(upload_folder):
            os.makedirs(upload_folder)
        file_path = os.path.join(upload_folder, filename)
        file.save(file_path)

        text = extract_text_from_pdf(file_path)
        summary = summarize_text(text)

        summary_filename = filename.rsplit('.', 1)[0] + '_summary.txt'
        summary_path = os.path.join(upload_folder, summary_filename)
        with open(summary_path, 'w', encoding='utf-8') as f:
            f.write(summary)

        results.append({
            "filename": filename,
            "content": {
                "extracted_text": text,
                "summary": summary,
                "summary_file": summary_filename
            }
        })

    output_json_path = os.path.join(current_app.config['UPLOAD_FOLDER'], 'results.json')
    with open(output_json_path, 'w', encoding='utf-8') as json_file:
        json.dump({"documents": results}, json_file, indent=4)

    return jsonify({"documents": results})


@upload_bp.route('/download-results')
def download_results():
    folder = current_app.config['UPLOAD_FOLDER']
    filename = 'results.json'
    try:
        return send_from_directory(folder, filename, as_attachment=True)
    except Exception as e:
        return jsonify({"error": str(e)}), 404
