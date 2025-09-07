import React from 'react';
import ResultCard from './ResultCard';

const ResultsList = ({ results, onDownloadEncryptedFile, onDownloadSummary }) => (
  <>
    <h2 className="results-heading">Summarization Results</h2>
    {results.map(({ filename, structured_data, summary, encrypted_file }, index) => (
      <ResultCard
        key={index}
        filename={filename}
        structured_data={structured_data}
        summary={summary}
        encFilename={encrypted_file}
        onDownloadEncrypted={onDownloadEncryptedFile}
      />
    ))}
    <button
      onClick={onDownloadSummary}
      className="download-button"
      style={{ marginBottom: 20 }}
    >
      Download Summary JSON
    </button>
  </>
);

export default ResultsList;
