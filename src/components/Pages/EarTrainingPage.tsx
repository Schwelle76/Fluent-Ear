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
import InputSelection from '../InputSelection';
import { useEarTrainingSettingsContext } from '../../contexts/EarTrainingSettingsContext';
import ImageCycle from '../ImageCycle';



const EarTrainingPage: React.FC = () => {

    const earTrainingSettings = useEarTrainingSettingsContext()
    const noteInput = useNoteInput()
    const earTrainingGame = useEarTrainingGame(noteInput.note, earTrainingSettings.scale, earTrainingSettings.root, earTrainingSettings.direction)


    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    useGlobalPointer((ev) => {
        if (earTrainingGame.active && !earTrainingGame.output && !isSidebarOpen)
            earTrainingGame.replayNotes();
    });

    useEffect(() => {
        if (noteInput.ready)
            earTrainingGame.start();
    }, [noteInput.ready])



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

            <div className={styles.topBar}>
                {!isSidebarOpen && (
                    <button className={styles.sidebarToggle} onClick={() => setIsSidebarOpen(true)}>
                        ☰
                    </button>
                )}
                {earTrainingGame.active &&
                    <span className={styles.score}>{earTrainingGame.score > 0 ? earTrainingGame.score : ""}</span>}

            </div>



            <div className={styles.centerElement}>

                {!noteInput.inputDevice &&
                    <InputSelection noteInput={noteInput} />
                }

                {noteInput.inputDevice && !noteInput.ready &&
                    <h1>Allow microphone access to detect your intrument!</h1>
                }

                {noteInput.inputDevice && earTrainingGame.active && noteInput.ready &&
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


            <div className={styles.bottomBar}>
                <img className={`${styles.soundIcon} ${earTrainingGame.output ? styles.show : styles.hide}`} src={"./src/assets/volume-mid.svg"} alt={"Turn on volume"} />
            </div>

            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />
        </div>
    )

}

export default EarTrainingPage;
