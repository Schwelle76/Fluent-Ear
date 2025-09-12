import useEarTrainingGame from './hooks/useEarTrainingGame'
import { useEarTrainingSettingsContext } from './contexts/EarTrainingSettingsContext'
import useNoteInput from './hooks/useNoteInput'
import EarTrainingPage from './components/Pages/EarTrainingPage'
import EntryPage from './components/Pages/EntryPage'
import { useEffect } from 'react'

function App() {

  const earTrainingSettings = useEarTrainingSettingsContext()
  const noteInput = useNoteInput()
  const earTrainingGame = useEarTrainingGame(noteInput.note, earTrainingSettings.scale, earTrainingSettings.root, earTrainingSettings.direction)


  return (
    <div>
      {!noteInput.inputDevice ? (
        <EntryPage noteInput={noteInput} />
      ) : (
        <EarTrainingPage noteInput={noteInput} earTrainingGame={earTrainingGame} />
      )}
    </div>
  )
}

export default App
