import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Heebo as a variable font: one bundled file covers every weight (300 for headings, 400-700 for text),
// including the Hebrew subset. No request to Google at runtime.
import '@fontsource-variable/heebo'

import '@/styles/tokens.css'
import '@/styles/global.css'

import { App } from '@/app/App'
import { preloadLikelyPages } from '@/app/pageLoaders'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

preloadLikelyPages()
