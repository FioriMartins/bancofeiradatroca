import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AppRoutes from './Routes.jsx'
import './index.css'

// console.warn = () => {};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppRoutes />
  </StrictMode>,
)