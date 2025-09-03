import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import {EarTrainingSettingsContext} from './contexts/EarTrainingSettingsContext'
import useEarTrainingSettings from './hooks/useEarTrainingSettings'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)

function Root(){
  const trainingSettings = useEarTrainingSettings()

  return(
    <EarTrainingSettingsContext value={trainingSettings}>
      <App />
    </EarTrainingSettingsContext>
  )
}
