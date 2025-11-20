import styles from './EarTrainingPage.module.css'
import React, { use, useEffect, useRef, useState } from 'react';
import Sidebar from '../Sidebar';
import NoteDisplay from '../NoteDisplay';
import { useGlobalPointer } from '../../hooks/useGlobalPointer';
import useNoteInput from '../../hooks/useNoteInput';
import useEarTrainingGame from '../../hooks/useEarTrainingGame';
import NoteInputButtonGrid from '../NoteInputButtonGrid';
import InputSelection from '../InputSelection';
import { useEarTrainingSettingsContext } from '../../contexts/EarTrainingSettingsContext';
import volumeIcon from '../../assets/volume-mid.svg';
import LoadingIcon from '../LoadingIcon';
import NoteInputPanel from '../NoteInputPanel';
import animation from '../../animations.module.css';
import LevelDropdown from '../LevelDropdown';



const EarTrainingPage: React.FC = () => {

    const earTrainingSettings = useEarTrainingSettingsContext()
    const noteInput = useNoteInput()
    const [customMelodyLength, setCustomMelodyLength] = useState(earTrainingSettings.melodyLength);
    const [customScale, setCustomScale] = useState(earTrainingSettings.scale);
    const [customRoot, setCustomRoot] = useState(earTrainingSettings.root);
    const [customDirection, setCustomDirection] = useState(earTrainingSettings.direction);


    const earTrainingGame = useEarTrainingGame(noteInput.note, customScale, customRoot, customDirection, customMelodyLength);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [isLevelDropdownOpen, setIsLevelDropdownOpen] = useState(false)

    const [microphoneCalibrated, setMicrophoneCalibrated] = useState(false);


    const score = earTrainingGame.score;
    const percentageScore = Math.round((score / earTrainingGame.maxScore) * 100);

    const everyThingReady: boolean = noteInput.inputDevice != undefined && earTrainingGame.active && earTrainingGame.ready && noteInput.ready && microphoneCalibrated;



    useEffect(() => {
        if (!isSidebarOpen) {
            setCustomMelodyLength(earTrainingSettings.melodyLength);
            setCustomScale(earTrainingSettings.scale);
            setCustomRoot(earTrainingSettings.root);
            setCustomDirection(earTrainingSettings.direction);
        }

    }, [isSidebarOpen, earTrainingSettings]);


    useEffect(() => {

        if (earTrainingSettings.level >= 0) {
            if (percentageScore >= 100) {
                earTrainingSettings.setLevel((prev) => prev + 1);
            }
        }
    }, [score])

    useEffect(() => {
        if (noteInput.inputDevice === 'ui')
            earTrainingGame.skipRoot(true);
        else earTrainingGame.skipRoot(false);

        if (noteInput.inputDevice === 'ui' || noteInput.inputDevice === 'keyboard') {
            setMicrophoneCalibrated(true);
        }
    }, [noteInput.inputDevice])


    useGlobalPointer((ev) => {
        if (earTrainingGame.active && !earTrainingGame.isTalking && !isSidebarOpen && !isLevelDropdownOpen)
            earTrainingGame.replayQuestion();
    });

    useEffect(() => {
        if (noteInput.ready && microphoneCalibrated)
            earTrainingGame.start();
    }, [noteInput.ready, microphoneCalibrated])


    return (

        <div className={styles.appContainer}>

            <div className={styles.topBar}>
                {!isSidebarOpen && (
                    <button className={styles.sidebarToggle} onClick={() => setIsSidebarOpen(true)}>
                        ☰
                    </button>
                )}

                <div className= {styles.levelDropdown}>
                    <LevelDropdown selectedLevel={earTrainingSettings.level} onChange={earTrainingSettings.setLevel} unlockedLevels={earTrainingSettings.unlockedLevels} onToggle={setIsLevelDropdownOpen} />    
                </div>

                <span
                    className={`${styles.score} ${styles[earTrainingGame.targetNotesChannelOutput[earTrainingGame.currentQuestionIndex].style]}`}
                >{`${percentageScore}%`}</span>

            </div>



            <div className={everyThingReady ? styles.centerElement : styles.bottom}>


                {noteInput.inputDevice && earTrainingGame.active && earTrainingGame.ready && noteInput.ready && microphoneCalibrated &&
                    <NoteDisplay
                        styledNotes={[...earTrainingGame.targetNotesChannelOutput]}
                        root={earTrainingGame.root}
                        activeNoteIndex={earTrainingGame.selectedNoteIndex}
                    />}
            </div>


            <div className={everyThingReady ? styles.bottom : styles.centerElement}>


                {!noteInput.inputDevice &&
                    <InputSelection noteInput={noteInput} />
                }

                {noteInput.inputDevice && !noteInput.ready &&
                    <div className={styles.centerElement}>
                        <h1>Allow microphone access to detect your intrument!</h1>
                    </div>
                }


                {noteInput.inputDevice && earTrainingGame.active && !earTrainingGame.ready && noteInput.ready && microphoneCalibrated &&
                    <LoadingIcon />
                }

                {noteInput.inputDevice != 'ui' && noteInput.ready &&
                    <div className={!microphoneCalibrated ? styles.absoluteCenter : styles.returnToOrigin}>
                        <div className={!microphoneCalibrated ? animation.growUp : animation.shrinkAway}>
                            <h2 >Adjust sensitivity so that ONLY the notes you play are shown!</h2>
                            <hr />
                            <br />
                        </div>

                        <div style={!microphoneCalibrated ? { fontSize: "1.5rem" } : {}}>
                            <NoteInputPanel noteInput={noteInput} />
                        </div>

                        <div className={!microphoneCalibrated ? animation.growUp : animation.shrinkAway}>
                            <br />
                            <hr />
                            <p className={!microphoneCalibrated ? animation.growUp : animation.shrinkAway}>If unplayed notes flash on the screen, lower the sensitivity.</p>
                            <button className={!microphoneCalibrated ? animation.growUp : animation.shrinkAway} onClick={() => setMicrophoneCalibrated((prev) => !prev)}>Done</button>
                        </div>
                    </div>
                }

                {earTrainingGame.ready && noteInput.ready && noteInput.inputDevice === 'ui' &&
                    <NoteInputButtonGrid intervals={customScale.intervals} resetTrigger={earTrainingGame.selectedNoteIndex} noteInput={noteInput} root={earTrainingGame.root.pitchClass} active={!earTrainingGame.isTalking} direction={customDirection} />}

            </div>



            <div className={styles.lowerLeft}>
                <img className={`${styles.soundIcon} ${earTrainingGame.isTalking ? animation.show : animation.hide}`} src={volumeIcon} alt={"Turn on volume"} />
            </div>

            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />
        </div>
    )

}

export default EarTrainingPage;
