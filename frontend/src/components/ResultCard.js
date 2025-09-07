import React from 'react';

const ResultCard = ({ filename, structured_data, summary, encFilename, onDownloadEncrypted }) => {

  const caseNumber = structured_data?.case_number || 'N/A';
  const clientName = structured_data?.client_name || 'N/A';
  const courtDate = structured_data?.court_date || 'N/A';
  const legalSections = structured_data?.legal_sections || [];

  return (
    <div className="result-card">
      <h3 className="result-title">{filename}</h3>
      <button 
        onClick={() => onDownloadEncrypted(encFilename, filename)} 
        style={{ marginBottom: 10, cursor: 'pointer' }}
      >
        Download Encrypted File
      </button>

      <details style={{ marginBottom: 10 }}>
        <summary className="details-summary">Structured Data</summary>
        <div>
          <strong>Case Number:</strong> {caseNumber}<br />
          <strong>Client Name:</strong> {clientName}<br />
          <strong>Court Date:</strong> {courtDate}<br />
          <strong>Legal Sections:</strong>
          <ul>
            {legalSections.map((sec, i) => (
              <li key={i}>{sec}</li>
            ))}
          </ul>
        </div>
      </details>

      <details open>
        <summary className="details-summary">Summary</summary>
        <p className="summary-text" style={{ whiteSpace: 'pre-wrap' }}>
          {summary || 'No summary generated.'}
        </p>
      </details>
    </div>
  );
};

export default ResultCard;
