import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { SettingsProvider } from './state/SettingsContext'
import { ProgressProvider } from './state/ProgressContext'
import { ErrorBoundary } from './components/ErrorBoundary'
// ฟอนต์ Sarabun ฝังในแอป ใช้ได้แม้ออฟไลน์ (เฉพาะชุดอักษรไทยและละติน)
import '@fontsource/sarabun/thai-400.css'
import '@fontsource/sarabun/thai-600.css'
import '@fontsource/sarabun/thai-700.css'
import '@fontsource/sarabun/latin-400.css'
import '@fontsource/sarabun/latin-600.css'
import '@fontsource/sarabun/latin-700.css'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <SettingsProvider>
        <ProgressProvider>
          <App />
        </ProgressProvider>
      </SettingsProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)
