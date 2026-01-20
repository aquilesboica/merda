
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

console.log("PDF AI Tutor: Initializing entry point...");

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log("PDF AI Tutor: React tree rendered successfully.");
} catch (error) {
  console.error("PDF AI Tutor: Critical error during mount:", error);
}
