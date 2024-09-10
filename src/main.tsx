import { createRoot } from 'react-dom/client';
import * as React from 'react'
import App from './App.tsx'
import './index.css'

const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
