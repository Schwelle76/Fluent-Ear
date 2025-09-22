import React from 'react';
import style from './NoteDisplay.module.css';
import { StyledMessage } from '../models/StyledMessage';
import { getInterval, isPitchClass, PitchClass } from '../models/Note';

interface NoteDisplayProps {
  notes: StyledMessage[];
  root: PitchClass;
}

const NoteDisplay: React.FC<NoteDisplayProps> = ({ notes, root}) => {
  return (
    <div className={style.noteDisplayContainer}>
      
      {notes.map((note, index) => {
        
        const message = note.message;
        let content: string;

        if (isPitchClass(message)) {
          content = getInterval(message, root); 
        } else {
          content = message;
        }

        return (
          <div key={index} className={`${style.noteDisplay} ${style[note.style]}`}>
            <div className={style.currentNote}>
              <span>{note.message}</span>
            </div>
            <div className={style.currentInterval}>
              <span>{content}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NoteDisplay;