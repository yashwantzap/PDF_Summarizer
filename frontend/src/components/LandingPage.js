import React from 'react';
import './LandingPage.css';

const LandingPage = ({ onEnter }) => (
  <div className="landing-container">
    <div className="content-box">
      <h1 className="landing-title">Welcome to PDF Summarizer</h1>
      <p className="landing-subtitle">
        Upload your PDF documents and get concise, meaningful summaries in seconds.
      </p>
      <button className="enter-button" onClick={onEnter}>
        Get Started
      </button>
    </div>
    <footer className="landing-footer">© 2025 PDF Summarizer</footer>
  </div>
);

export default LandingPage;
