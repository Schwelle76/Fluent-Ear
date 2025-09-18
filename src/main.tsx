import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { EarTrainingSettingsContext } from './contexts/EarTrainingSettingsContext'
import useEarTrainingSettings from './hooks/useEarTrainingSettings'
import { createBrowserRouter, RouterProvider } from 'react-router'
import EntryPage from './components/Pages/EntryPage'
import EarTrainingPage from './components/Pages/EarTrainingPage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)


const router = createBrowserRouter([
  {
    path: '/',
    element: <EntryPage/>,
  },
  {
    path:'/training',
    element: <EarTrainingPage/>,
  }
])

function Root() {
  const trainingSettings = useEarTrainingSettings()

  return (
    <EarTrainingSettingsContext value={trainingSettings}>
      <RouterProvider router={router} />
    </EarTrainingSettingsContext>
  )
}
