# PDF Summarizer

Secure full-stack web application built with Python Flask backend and React frontend that allows users to upload PDF documents, extract and translate text, generate summaries, and perform metadata search.

## Table of Contents

- Project Overview  
- Features  
- Technology Stack  
- Setup and Installation  
- Usage   
- API Endpoints  
- Project Structure  
- Development Notes  
- Troubleshooting  
- Future Enhancements  
- License  

## Project Overview

This application enables secure uploading of PDF documents. Backend extracts text, uses AI-powered translation to convert text to English (if needed), and summarizes the content. Users can search uploaded files by case number, client name, or upload date and download encrypted files or JSON summaries.

## Features

- Secure encrypted file uploads (PDF, DOCX, JPG/PNG)
- PDF text extraction with OCR support
- Neural machine translation to English using Google Cloud Translation API
- Text summarization using NLP libraries
- Search uploaded metadata with multi-parameter filters
- Download encrypted original files and JSON summaries
- Modular React frontend with intuitive UI and responsive design

## Technology Stack

| Layer          | Technology                                  |
|----------------|---------------------------------------------|
| Backend        | Python, Flask                             |
| Database       | SQLite                                   |
| Translation    | Google Cloud Translation API             |
| Text Extraction| PyMuPDF, pytesseract                      |
| Summarization  | NLTK, Sumy                               |
| Encryption     | cryptography (AES encryption)             |
| Frontend       | React, JavaScript, HTML5, CSS3             |

## Setup and Installation

### Prerequisites

- Python 3.11+
- Node.js 16+ and npm
- Google Cloud account (for translation API)
- Git for versioning

### Backend Setup

1. Clone the repository

    ```
    git clone https://github.com/yourusername/PDF_Summarizer.git
    cd PDF_Summarizer/backend
    ```

2. Create and activate a Python virtual environment

    ```
    python -m venv venv
    # Windows
    .\venv\Scripts\activate
    # macOS/Linux
    source venv/bin/activate
    ```

3. Install Python dependencies

    ```
    pip install -r requirements.txt
    ```

4. Set Google Cloud Credentials environment variable

    ```
    export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/service-account.json"
    ```

5. Run the Flask backend

    ```
    python app.py
    ```

### Frontend Setup

1. Change directory to frontend

    ```
    cd ../frontend
    ```

2. Install npm dependencies

    ```
    npm install
    ```

3. Start React development server

    ```
    npm start
    ```

4. Open http://localhost:3000 in a web browser

## Usage

### Upload Document and Summarize

- Go to "Upload Documents" tab.
- Enter case number, client name, and upload date.
- Choose one or multiple PDF documents.
- Click **Upload and Summarize**.
- View extracted structured data and summaries.
- Download encrypted files or summary JSON.

### Search Metadata

- Select "Search Metadata" tab.
- Choose to search by case number or upload date.
- Enter search parameters (optional client name).
- Click **Search**.
- View matching results and download files.

## API Endpoints

| Endpoint                     | Method | Description                                     |
|------------------------------|--------|-------------------------------------------------|
| `/secure-upload`              | POST   | Upload files with metadata, encrypt & summarize |
| `/secure-download/<file>`     | GET    | Download decrypted original file                 |
| `/secure-metadata-search`     | GET    | Search files by case number, client name, date  |
| `/download-summary/<case_no>` | GET    | Download summary JSON for a case                  |


## Development Notes

- Modular architecture separates concerns clearly.
- Translation uses Google Cloud Translation API for accuracy.
- Encryption uses AES symmetric encryption in Python.
- Text extraction supports images via OCR with Tesseract.
- Frontend uses React hooks and components with clean and responsive UI.
- Backend persists metadata in lightweight SQLite DB.
- Use `.env` or environment vars to manage sensitive config.

## Troubleshooting

- Ensure Google credentials env variable is set before running backend.
- Review backend logs if uploads or translation fail.
- Refresh frontend after code changes.
- Clear `node_modules` and reinstall if React errors persist.
- Check network requests & errors in browser dev tools.

## Future Enhancements

- User authentication and multi-user support.
- Improved extraction using ML models.
- Support more document types and batch processing.
- Production deployment with Docker and CI/CD.
- Add analytics and advanced reporting.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
