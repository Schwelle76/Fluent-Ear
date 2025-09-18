import React, { useEffect, useState } from 'react';
import { useEarTrainingSettingsContext } from '../contexts/EarTrainingSettingsContext';
import { Scale } from '../models/Scale';
import { getPitchClass, Interval } from '../models/Note';
import useEarTrainingGame from '../hooks/useEarTrainingGame';
import useNoteInput from '../hooks/useNoteInput';
import styles from './NoteInputButtonGrid.module.css';

interface NoteInputButtonGridProps {
    noteInput: ReturnType<typeof useNoteInput>;
    earTrainingGame: ReturnType<typeof useEarTrainingGame>;

}



const NoteInputButtonGrid: React.FC<NoteInputButtonGridProps> = ({ noteInput, earTrainingGame }) => {

    const [clickedButtons, setClickedButtons] = useState<Set<string>>(new Set());
    const settings = useEarTrainingSettingsContext();
    const intervals = settings.scale.getIntervals();


    useEffect(() => {
        setClickedButtons(new Set());
    }, [earTrainingGame.score, settings]);

    const handleButtonClick = (interval: Interval) => {
        setClickedButtons(prev => new Set(prev).add(interval));
        noteInput.setUiInput(getPitchClass(earTrainingGame.root, interval));
    };



    return (


        <div className={styles.noteInputButtonGrid}>
            {intervals.map(interval => (
                <button
                    key = {interval}
                    className={`${styles['note-input-button']} ${clickedButtons.has(interval) || earTrainingGame.output ? styles.inactive : ''}`}
                    onClick={() => handleButtonClick(interval)}
                >
                    {interval}
                </button>
            ))}
        </div>
    );

}

export default NoteInputButtonGrid;
