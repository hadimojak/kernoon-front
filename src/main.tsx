import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import { SupportChatWidget } from './components/SupportChatWidget.tsx'
import { LanguageProvider } from './i18n/LanguageProvider.tsx'
import './styles/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <App />
        <SupportChatWidget />
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>,
)