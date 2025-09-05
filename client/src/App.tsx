import { useState, useEffect, useContext, createContext } from 'react'
import NoteDisplay from './components/NoteDisplay'
import Sidebar from './components/Sidebar'
import SensitivitySlider from './components/SensitivitySlider'
import './App.css'
import useEarTrainingGame from './hooks/useEarTrainingGame'
import { useEarTrainingSettingsContext } from './contexts/EarTrainingSettingsContext'
import useNoteInput from './hooks/useNoteInput'
import { useGlobalPointer } from './hooks/useGlobalPointer'
import { getInterval, isPitchClass, PITCH_CLASSES } from './models/Note'

function App() {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const earTrainingSettings = useEarTrainingSettingsContext()

  const noteInput = useNoteInput()


  const earTrainingGame = useEarTrainingGame(noteInput.note, earTrainingSettings.scale, earTrainingSettings.root, earTrainingSettings.direction)

  useGlobalPointer((ev) => {
    if (earTrainingGame.active && !isSidebarOpen)
      earTrainingGame.replayNotes();
  });


  const displayPitch = earTrainingGame.output ? earTrainingGame.output : noteInput.note?.toString();

  let displayInterval : string | undefined
  if(earTrainingGame.output){
    if(isPitchClass(earTrainingGame.output))
        displayInterval = getInterval(earTrainingGame.output, earTrainingGame.root);
  else displayInterval = earTrainingGame.output;
} else displayInterval = noteInput.note ? getInterval(noteInput.note, earTrainingGame.root) : undefined;



  return (

    <div className="app-container">

      {!noteInput.ready && (
        <button className="mic-init-button" onClick ={ () => {
          noteInput.initialize().then(() => earTrainingGame.start())}}>
          Enable Microphone
        </button>
      )}

      {noteInput.ready && !earTrainingGame.active && (
        <button onClick={() => earTrainingGame.start()}>
          Start
        </button>
      )}


      {!isSidebarOpen && (
        <button className="sidebar-toggle" onClick={() => setIsSidebarOpen(true)}>
          ☰
        </button>
      )}


      {earTrainingGame.active && noteInput.ready && <NoteDisplay
        currentNote={displayPitch}
        currentInterval={displayInterval}
      />}

      {noteInput.ready && noteInput.inputDevice === 'microphone' && <SensitivitySlider
        value={noteInput.sensitivity}
        min={noteInput.MIN_SENSITIVITY}
        max={noteInput.MAX_SENSITIVITY}
        onChange={(e) => noteInput.setSensitivity(parseInt(e.target.value))}
      />}


      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
    </div>
  )
}

export default App
