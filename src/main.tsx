import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import LandingPge from "./LandingPage/index.tsx"
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LandingPge />
  </StrictMode>,
)
