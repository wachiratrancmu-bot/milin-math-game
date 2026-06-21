import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { SettingsProvider } from './state/SettingsContext'
import { ProgressProvider } from './state/ProgressContext'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SettingsProvider>
      <ProgressProvider>
        <App />
      </ProgressProvider>
    </SettingsProvider>
  </React.StrictMode>,
)
