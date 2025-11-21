import React, { use, useState } from 'react';
import { Note } from '../models/Note';
import useNoteInput from '../hooks/useNoteInput';
import SensitivitySlider from './SensitivitySlider';
import styles from './NoteInputPanel.module.css';
import CircledCharacter from './CircledCharacter';


interface NoteInputPanelProps {
    noteInput: ReturnType<typeof useNoteInput>;
}

const NoteInputPanel: React.FC<NoteInputPanelProps> = ({ noteInput }) => {

    const pitchClass = noteInput.note instanceof Note ? noteInput.note.pitchClass : noteInput.note;

    return (
        <div className={styles.noteInputPanel}>
            <div style={{fontSize: '5em', marginBottom: '.2em'}}>
            <CircledCharacter character={pitchClass ? pitchClass : " "} />
            </div>
            <div style={{fontSize: '.8em'}}>
            <SensitivitySlider noteInput={noteInput}/>
            </div>
        </div>
    )
}

export default NoteInputPanel;