# PDF Summarization App with OCR and React Frontend

This project is a simple yet powerful web application that helps you upload PDF documents and get concise summaries. It works even with scanned PDFs by using OCR to extract text. The backend is built with Python and Flask, while the frontend is a smooth React app designed for ease of use.

***

## What It Does

- Extracts text from PDFs using PyMuPDF, and applies OCR via Tesseract when needed (perfect for scanned documents).
- Summarizes the extracted content using a smart algorithm to capture the most important points.
- Lets you upload multiple PDFs at once.
- Gives you the option to download all summaries in one handy JSON file.
- Features a welcoming React landing page and a clean, user-friendly interface.
- Structured Flask backend with clear separation of concerns + easy CORS support for frontend-backend communication.

***

## Tech Stack

- **Backend:** Python, Flask, PyMuPDF, pytesseract (Tesseract OCR), NLTK, Sumy summarization, scikit-learn, NumPy
- **Frontend:** React, JavaScript, CSS
- **NOTE:** You’ll need to install Tesseract OCR separately on your system.

***

## How to Get Started

### Setting up the Backend

1.Go to the `backend` folder.
2. (Optional but recommended) Create a virtual environment and activate it:

```bash
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate
```

3. Install the Python packages this project needs:

```bash
pip install -r requirements.txt
```

4. Install Tesseract OCR on your machine:

- Windows: Download from the official site and install.
- macOS: Run `brew install tesseract`
- Linux (e.g. Ubuntu): Run `sudo apt-get install tesseract-ocr`

5. Make sure to update the Tesseract path in `core/extractor.py` if your installation is in a different folder.
6. Start the Flask server:

```bash
python app.py
```

Your backend will start on `http://127.0.0.1:5000`.

***

### Setting up the Frontend

1. Head to the frontend folder (or the root if combined).
2. Install the npm packages:

```bash
npm install
# or
yarn
```

3. Run the React app:

```bash
npm start
# or
yarn start
```

Your browser will open at `http://localhost:3000`.

***

## Using The App

1. When you open the app, you’ll see a friendly landing page. Click **Get Started** to jump in.
2. Select one or more PDF files to upload from the TestPDFs folder or upload a PDF from the local storage.
3. Hit the **Upload and Summarize** button and wait a moment for it to process.
4. Once done, you’ll see both the extracted text and summary for each document.
5. You can also download a JSON file with all the summaries gathered for easy reference or further use.

***

## How the Code is Organized

```
backend/
  ├── app.py                 # Main server app setup
  ├── core/
  │    ├── extractor.py      # PDF text extraction and cleaning
  │    └── summarizer.py     # Extracts keywords & summarizes content
  ├── routes/
  │    └── upload_download_routes.py  # API endpoints for uploading and downloading
  ├── uploads/               # Where PDFs and summary files live
  └── requirements.txt       # Python deps

frontend/
  ├── src/
  │    ├── App.js            # Main React component
  │    ├── LandingPage.js    # Welcome page component
  │    ├── index.css         # Global styles
  │    └── App.css           # Component-specific styles
  └── package.json           # Frontend deps & scripts
```

***

## A Few Tips

- The uploads folder is inside the backend directory so everything stays tidy.
- Use TestPDFs for testing, story 1 contains text, and story2 contains photos of text.
- Double-check the Tesseract OCR path in `extractor.py` matches your system installation.
- The backend uses CORS so the frontend can talk to it without trouble.
- Remember OCR can take a bit longer, especially on large or image-heavy PDFs.
- If you see any errors, check both the frontend console and backend logs for clues.

***

## FEEL FREE TO CONTACT FOR ANY SUGGESTIONS / ADVICE.
