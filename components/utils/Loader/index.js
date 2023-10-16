// Loader.js
import React from 'react';
import { PuffLoader } from "react-spinners";

function Loader({ isLoading }) {
  if (!isLoading) return null;

  return (
    <div>
      {isLoading && (
        <div className="loading-overlay">
          <div className="sweet-loading">
            <PuffLoader color="#fff" loading={isLoading} size={100} />
          </div>
        </div>
      )}
      </div>
  );
}

export default Loader;
