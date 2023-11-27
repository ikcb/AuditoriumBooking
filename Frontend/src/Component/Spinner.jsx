// Spinner.js

import React from 'react';
import '../assets/spinner.css';

const Spinner = ({ show }) => {
  return (
    show && (
      <div className="spinner-overlay">
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      </div>
    )
  );
};

export default Spinner;
