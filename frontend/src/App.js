import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import UploadForm from './components/UploadForm';
import ResultsList from './components/ResultsList';
import SearchForm from './components/SearchForm';
import SearchResults from './components/SearchResults';
import './App.css';

function App() {
  const [entered, setEntered] = useState(false);
  const [mode, setMode] = useState('upload'); // 'upload' or 'search'

  // Upload states
  const [files, setFiles] = useState([]);
  const [caseNumber, setCaseNumber] = useState('');
  const [clientName, setClientName] = useState('');
  const [uploadDate, setUploadDate] = useState('');
  const [uploadResults, setUploadResults] = useState(null);

  // Search states
  const [searchBy, setSearchBy] = useState('case_number');
  const [searchCaseNumber, setSearchCaseNumber] = useState('');
  const [searchClientName, setSearchClientName] = useState('');
  const [searchUploadDate, setSearchUploadDate] = useState('');
  const [searchResults, setSearchResults] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUploadResults(null);
    setError(null);

    if (files.length === 0) {
      setError("Please select at least one file");
      setLoading(false);
      return;
    }
    if (!caseNumber || !clientName || !uploadDate) {
      setError("Please fill all metadata fields");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    files.forEach(file => formData.append('documents', file));
    formData.append('case_number', caseNumber);
    formData.append('client_name', clientName);
    formData.append('upload_date', uploadDate);

    try {
      const response = await fetch('http://127.0.0.1:5000/secure-upload', { method: 'POST', body: formData });
      if (!response.ok) throw new Error(`Server error: ${response.statusText}`);
      const data = await response.json();
      setUploadResults(data.uploaded || []);
    } catch (err) {
      setError(`Upload failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSearchResults(null);
    setError(null);

    const queryParams = new URLSearchParams();

    if (searchBy === 'case_number' && searchCaseNumber.trim()) {
      queryParams.append('case_number', searchCaseNumber.trim());
    } else if (searchBy === 'upload_date' && searchUploadDate.trim()) {
      queryParams.append('upload_date', searchUploadDate.trim());
    }

    if (searchClientName.trim()) {
      queryParams.append('client_name', searchClientName.trim());
    }

    try {
      const response = await fetch(`http://127.0.0.1:5000/secure-metadata-search?${queryParams.toString()}`);
      if (!response.ok) throw new Error(`Server error: ${response.statusText}`);
      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (err) {
      setError(`Search failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const downloadEncryptedFile = (encFilename, originalFilename) => {
    fetch(`http://127.0.0.1:5000/secure-download/${encodeURIComponent(encFilename)}`)
      .then(async res => {
        if (!res.ok) throw new Error("File download failed");
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = originalFilename;
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch(err => alert(err.message));
  };

  const downloadSummaryJson = () => {
    if (!caseNumber) {
      alert("No case number entered");
      return;
    }
    fetch(`http://127.0.0.1:5000/download-summary/${encodeURIComponent(caseNumber)}`)
      .then(async res => {
        if (!res.ok) throw new Error("Summary download failed");
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${caseNumber}_summary.json`;
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch(err => alert(err.message));
  };

  const switchToUpload = () => {
    setMode('upload');
    setError(null);
    setSearchResults(null);
  };

  const switchToSearch = () => {
    setMode('search');
    setError(null);
    setUploadResults(null);
  };

  if (!entered) {
    return <LandingPage onEnter={() => setEntered(true)} />;
  }

  return (
    <div className="app-container">
      <h1>PDF Summarizer</h1>

      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <button onClick={switchToUpload} disabled={mode === 'upload'} className="upload-button" style={{ marginRight: 10 }}>
          Upload Documents
        </button>
        <button onClick={switchToSearch} disabled={mode === 'search'} className="upload-button">
          Search Metadata
        </button>
      </div>

      {mode === 'upload' && (
        <>
          <UploadForm
            files={files}
            caseNumber={caseNumber}
            clientName={clientName}
            uploadDate={uploadDate}
            onFileChange={(e) => setFiles(Array.from(e.target.files))}
            onCaseNumberChange={(e) => setCaseNumber(e.target.value)}
            onClientNameChange={(e) => setClientName(e.target.value)}
            onUploadDateChange={(e) => setUploadDate(e.target.value)}
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
          />
          {uploadResults && uploadResults.length > 0 && (
            <ResultsList
              results={uploadResults}
              onDownloadEncryptedFile={downloadEncryptedFile}
              onDownloadSummary={downloadSummaryJson}
            />
          )}
        </>
      )}

      {mode === 'search' && (
        <>
          <SearchForm
            caseNumber={searchCaseNumber}
            clientName={searchClientName}
            uploadDate={searchUploadDate}
            onCaseNumberChange={(e) => setSearchCaseNumber(e.target.value)}
            onClientNameChange={(e) => setSearchClientName(e.target.value)}
            onUploadDateChange={(e) => setSearchUploadDate(e.target.value)}
            onSubmit={handleSearchSubmit}
            loading={loading}
            error={error}
            searchBy={searchBy}
            onSearchByChange={(e) => setSearchBy(e.target.value)}
          />
          {searchResults && searchResults.length > 0 && (
            <SearchResults
              results={searchResults}
              onDownloadEncryptedFile={downloadEncryptedFile}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;
