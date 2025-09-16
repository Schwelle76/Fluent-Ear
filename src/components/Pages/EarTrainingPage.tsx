import styles from './EarTrainingPage.module.css'
import React, { use, useEffect, useState } from 'react';
import Sidebar from '../Sidebar';
import SensitivitySlider from '../SensitivitySlider';
import NoteDisplay from '../NoteDisplay';
import { useGlobalPointer } from '../../hooks/useGlobalPointer';
import { getInterval, isPitchClass } from '../../models/Note';
import useNoteInput from '../../hooks/useNoteInput';
import useEarTrainingGame from '../../hooks/useEarTrainingGame';
import NoteInputButtonGrid from '../NoteInputButtonGrid';


interface EarTrainingPageProps {
    noteInput: ReturnType<typeof useNoteInput>;
    earTrainingGame: ReturnType<typeof useEarTrainingGame>;
}

const EarTrainingPage: React.FC<EarTrainingPageProps> = ({ noteInput, earTrainingGame }) => {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    useGlobalPointer((ev) => {
        if (earTrainingGame.active && !earTrainingGame.output && !isSidebarOpen)
            earTrainingGame.replayNotes();
    });

    useEffect(() => {
        if (noteInput.ready)
            earTrainingGame.start();
    }, [noteInput.ready])


    console.log(noteInput.note?.toString())

    let displayPitch: string | undefined
    if (noteInput.ready)
        displayPitch = earTrainingGame.output ? earTrainingGame.output : noteInput.note?.toString();
    else displayPitch = "Allow microphone access to detect your intrument!";

    let displayInterval: string | undefined
    if (earTrainingGame.output) {
        if (isPitchClass(earTrainingGame.output))
            displayInterval = getInterval(earTrainingGame.output, earTrainingGame.root);
        else displayInterval = earTrainingGame.output;
    } else displayInterval = noteInput.note ? getInterval(noteInput.note, earTrainingGame.root) : undefined;

    return (

        <div className={styles.appContainer}>

            {!isSidebarOpen && (
                <button className={styles.sidebarToggle} onClick={() => setIsSidebarOpen(true)}>
                    ☰
                </button>
            )}

            <div className={styles.centerElement}>

                {noteInput.inputDevice && !noteInput.ready &&
                    <h1>Allow microphone access to detect your intrument!</h1>
                }

                {earTrainingGame.active && noteInput.ready &&
                    <NoteDisplay
                        currentNote={displayPitch}
                        currentInterval={displayInterval}
                    />}
            </div>


            <div className={styles.bottom}>

                {noteInput.ready && noteInput.inputDevice === 'microphone' && <SensitivitySlider
                    value={noteInput.sensitivity}
                    min={noteInput.MIN_SENSITIVITY}
                    max={noteInput.MAX_SENSITIVITY}
                    onChange={(e) => noteInput.setSensitivity(parseInt(e.target.value))}
                />}

                {noteInput.ready && noteInput.inputDevice === 'ui' && <NoteInputButtonGrid noteInput={noteInput} earTrainingGame={earTrainingGame} />}
            
            </div>


            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />
        </div>
    )

}

export default EarTrainingPage;
