import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import MarkmapClass from './markmap-class.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <div className="flex flex-col h-screen p-2">
    <MarkmapClass/>
  </div>
)
