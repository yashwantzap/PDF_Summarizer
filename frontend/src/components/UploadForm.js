import React from 'react';

const UploadForm = ({
  files,
  caseNumber,
  clientName,
  uploadDate,
  onFileChange,
  onCaseNumberChange,
  onClientNameChange,
  onUploadDateChange,
  onSubmit,
  loading,
  error,
}) => (
  <form onSubmit={onSubmit} className="upload-form">
    <input
      type="file"
      accept="application/pdf"
      multiple
      onChange={onFileChange}
      className="file-input"
    />
    <input
      type="text"
      placeholder="Case Number"
      value={caseNumber}
      onChange={onCaseNumberChange}
      required
      style={{ marginTop: 10, maxWidth: 420, padding: '10px', fontSize:'1rem' }}
    />
    <input
      type="text"
      placeholder="Client Name"
      value={clientName}
      onChange={onClientNameChange}
      required
      style={{ marginTop: 10, maxWidth: 420, padding: '10px', fontSize:'1rem' }}
    />
    <input
      type="date"
      value={uploadDate}
      onChange={onUploadDateChange}
      required
      style={{ marginTop: 10, maxWidth: 420, padding:'10px', fontSize:'1rem' }}
    />
    <button type="submit" disabled={loading} className="upload-button" style={{ marginTop: 25 }}>
      {loading ? 'Processing...' : 'Upload and Summarize'}
    </button>
    {error && <div className="error-message">{error}</div>}
  </form>
);

export default UploadForm;
