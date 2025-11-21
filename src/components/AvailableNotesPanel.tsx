import React from 'react';
import { Interval } from "../models/Note";
import styles from './AvailableNotesPanel.module.css';


interface AvailableNotesPanelProps {
    availableNotes: Interval[];
    blockedNotes: Interval[];
}


const AvailableNotesPanel: React.FC<AvailableNotesPanelProps> = ({ availableNotes, blockedNotes }) => {

    return (
        <div>
            <span className={styles.noteContainer}>
                {availableNotes.map((interval, index) => (
                    <div key={index + interval}>
                        <span className={blockedNotes.includes(interval) ? styles.blocked : ""}>{interval}</span>
                    </div>
                ))}
            </span>
        </div>
    )
}

export default AvailableNotesPanel;