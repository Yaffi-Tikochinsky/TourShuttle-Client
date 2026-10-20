import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Fonts are bundled with the app (no request to Google at runtime). Each file includes the Hebrew subset.
import '@fontsource/frank-ruhl-libre/500.css'
import '@fontsource/frank-ruhl-libre/700.css'
import '@fontsource/assistant/400.css'
import '@fontsource/assistant/600.css'
import '@fontsource/assistant/700.css'

import '@/styles/tokens.css'
import '@/styles/global.css'

import { App } from '@/app/App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
