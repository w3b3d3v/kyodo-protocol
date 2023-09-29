// Loader.js
import React from 'react';
import { BeatLoader } from "react-spinners";

function Loader({ isLoading }) {
  if (!isLoading) return null;

  return (
    <div>
      {isLoading && (
        <div className="loading-overlay">
          <div className="sweet-loading">
            <BeatLoader loading={isLoading} size={50} />
          </div>
        </div>
      )}
      </div>
  );
}

export default Loader;
