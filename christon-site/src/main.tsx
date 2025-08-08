import React from 'react'
import ReactDOM from 'react-dom/client'
import { Router } from './router'
import './index.css'

function initGA() {
  const id = import.meta.env.VITE_GA_ID as string | undefined;
  if (!id) return;
  const gtagScript = document.createElement('script');
  gtagScript.async = true;
  gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(gtagScript);
  const s = document.createElement('script');
  s.innerHTML = `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${id}');`;
  document.head.appendChild(s);
}

initGA();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>,
)
