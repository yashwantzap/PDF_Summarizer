import React from 'react';

const SearchResults = ({ results, onDownloadEncryptedFile }) => (
  <>
    <h2 className="results-heading">Search Results</h2>
    {results.map(({ filename, encrypted_file, case_number, client_name, upload_date }, index) => (
      <div key={index} className="result-card">
        <h3 className="result-title">{filename}</h3>
        <p><strong>Case Number:</strong> {case_number || 'N/A'}</p>
        <p><strong>Client Name:</strong> {client_name || 'N/A'}</p>
        <p><strong>Upload Date:</strong> {upload_date || 'N/A'}</p>
        <button
          onClick={() => onDownloadEncryptedFile(encrypted_file, filename)}
          style={{ marginTop: 10, cursor: 'pointer' }}
        >
          Download Encrypted File
        </button>
      </div>
    ))}
  </>
);

export default SearchResults;
