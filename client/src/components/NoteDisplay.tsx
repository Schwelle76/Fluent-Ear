import React from 'react';
import './NoteDisplay.css';

interface NoteDisplayProps {
  currentNote: string | undefined;
  currentInterval: string | undefined;
}


const NoteDisplay:React.FC<NoteDisplayProps> = ({ currentNote, currentInterval }) => {
  return (
      <div className="note-display">
        <h1 className="current-note">{currentNote}</h1>
        {currentInterval && <p className="current-interval">{currentInterval}</p>}
      </div>
  );
};

export default NoteDisplay;
