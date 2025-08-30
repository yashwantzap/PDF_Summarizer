import React, { useState } from 'react';
import LandingPage from './LandingPage';
import './App.css';

function App() {
  const [entered, setEntered] = useState(false);
  const [files, setFiles] = useState([]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handler when user chooses files
  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  // Handler to upload and summarize PDFs
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResults(null);
    setError(null);

    if (files.length === 0) {
      setError("Please select at least one PDF file");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append('documents', file));

    try {
      const response = await fetch('http://127.0.0.1:5000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error(`Server error: ${response.statusText}`);

      const data = await response.json();
      setResults(data.documents);
    } catch (err) {
      setError(`Upload failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Download results.json file from backend
  const downloadResultsJson = () => {
    fetch('http://127.0.0.1:5000/download-results')
      .then((response) => {
        if (!response.ok) throw new Error('Failed to download results');
        return response.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'results.json');
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      })
      .catch((error) => alert(error.message));
  };

  // Show landing page or main app UI
  if (!entered) {
    return <LandingPage onEnter={() => setEntered(true)} />;
  }

  // Main PDF Summarizer UI
  return (
    <div className="app-container">
      <h1>PDF Summarizer</h1>

      <form onSubmit={handleSubmit} className="upload-form">
        <input
          type="file"
          accept="application/pdf"
          multiple
          onChange={handleFileChange}
          className="file-input"
        />
        <br />
        <button type="submit" disabled={loading} className="upload-button">
          {loading ? 'Processing...' : 'Upload and Summarize'}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {/* Show download button only if results exist */}
      {results && results.length > 0 && (
        <>

          <div>
            <h2 className="results-heading">Summarization Results</h2>
            {results.map(({ filename, content }, index) => (
              <div key={index} className="result-card">
                <h3 className="result-title">{filename}</h3>

                <details style={{ marginBottom: 10 }}>
                  <summary className="details-summary">Extracted Text</summary>
                  <p className="extracted-text">
                    {content.extracted_text || 'No text extracted.'}
                  </p>
                </details>

                <details open>
                  <summary className="details-summary">Summary</summary>
                  <p className="summary-text">{content.summary || 'No summary generated.'}</p>
                </details>
              </div>
            ))}
          </div>
           <button onClick={downloadResultsJson} className="download-button" style={{ marginBottom: 20 }}>
            Download Summary JSON
          </button>
        </>
      )}
    </div>
  );
}

export default App;
