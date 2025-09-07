import React from 'react';

const SearchForm = ({
  caseNumber,
  clientName,
  uploadDate,
  onCaseNumberChange,
  onClientNameChange,
  onUploadDateChange,
  onSubmit,
  loading,
  error,
  searchBy,
  onSearchByChange,
}) => (
  <form onSubmit={onSubmit} className="upload-form" style={{ maxWidth: 450, margin: '0 auto' }}>
    <div style={{ marginBottom: 15, textAlign: 'left', color: '#064e3b' }}>
      <label>
        <input
          type="radio"
          name="searchBy"
          value="case_number"
          checked={searchBy === 'case_number'}
          onChange={onSearchByChange}
          style={{ marginRight: 8 }}
        />
        Search by Case Number
      </label>
      <label style={{ marginLeft: 20 }}>
        <input
          type="radio"
          name="searchBy"
          value="upload_date"
          checked={searchBy === 'upload_date'}
          onChange={onSearchByChange}
          style={{ marginRight: 8 }}
        />
        Search by Upload Date
      </label>
    </div>

    {searchBy === 'case_number' && (
      <input
        type="text"
        placeholder="Case Number"
        value={caseNumber}
        onChange={onCaseNumberChange}
        style={inputStyle}
        required
      />
    )}

    {searchBy === 'upload_date' && (
      <input
        type="date"
        value={uploadDate}
        onChange={onUploadDateChange}
        style={inputStyle}
        required
      />
    )}

    <input
      type="text"
      placeholder="Client Name (optional)"
      value={clientName}
      onChange={onClientNameChange}
      style={inputStyle}
    />

    <button type="submit" disabled={loading} className="upload-button" style={{ marginTop: 25 }}>
      {loading ? 'Searching...' : 'Search'}
    </button>
    {error && <div className="error-message">{error}</div>}
  </form>
);

const inputStyle = {
  marginTop: 10,
  maxWidth: 420,
  padding: '10px 15px',
  fontSize: '1.1rem',
  borderRadius: 8,
  border: '2px solid #cbd5e0',
  outline: 'none',
  boxShadow: 'inset 0 0 6px rgba(34, 197, 94, 0.15)',
  color: '#064e3b',
};

export default SearchForm;
