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
import ChallengePresentation from '../ChallengePresentation';
import Calibration from '../Calibration';
import AvailableNotesPanel from '../AvailableNotesPanel';
import { getIntervalsFromPitch, Note } from '../../models/Note';
import SensitivitySlider from '../SensitivitySlider';
import CircledCharacter from '../CircledCharacter';


const EarTrainingPage: React.FC = () => {

    const earTrainingSettings = useEarTrainingSettingsContext()
    const noteInput = useNoteInput()
    const [cachedMelodyLength, setCachedMelodyLength] = useState(earTrainingSettings.melodyLength);
    const [cachedScale, setCachedScale] = useState(earTrainingSettings.scale);
    const [cachedRoot, setCachedRoot] = useState(earTrainingSettings.root);
    const [cachedDirection, setCachedDirection] = useState(earTrainingSettings.direction);


    const earTrainingGame = useEarTrainingGame(noteInput.note, cachedScale, cachedRoot, cachedDirection, cachedMelodyLength);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [isLevelDropdownOpen, setIsLevelDropdownOpen] = useState(false)

    const [microphoneCalibrated, setMicrophoneCalibrated] = useState(false);
    const [challengePresented, setChallengePresented] = useState(false);


    const score = earTrainingGame.score;
    const percentageScore = Math.round((score / earTrainingGame.maxScore) * 100);


    const everyThingReady: boolean = noteInput.inputDevice != undefined && earTrainingGame.ready && noteInput.ready && microphoneCalibrated;
    const detectedPitchClass = noteInput.note instanceof Note ? noteInput.note.pitchClass : noteInput.note;


    useEffect(() => {
        if (!isSidebarOpen) {
            setCachedMelodyLength(earTrainingSettings.melodyLength);
            setCachedScale(earTrainingSettings.scale);
            setCachedRoot(earTrainingSettings.root);
            setCachedDirection(earTrainingSettings.direction);
        }

    }, [isSidebarOpen, earTrainingSettings]);

    useEffect(() => {
        setChallengePresented(false);
    }, [earTrainingSettings])


    useEffect(() => {

        if (earTrainingSettings.level >= 0) {
            if (percentageScore >= 100 && earTrainingGame.selectedNoteIndex === 0) {
                earTrainingSettings.setLevel((prev) => prev + 1);
                setChallengePresented(false);
            }
        }
    }, [score, earTrainingGame.selectedNoteIndex])

    useEffect(() => {
        earTrainingGame.stopOnMaxScore.current = earTrainingSettings.level >= 0;
    }, [earTrainingSettings.level])

    useEffect(() => {
        if (noteInput.inputDevice === 'ui') {
            earTrainingGame.skipRoot(true);
            earTrainingGame.silentFurtherPunishments.current = false;
        }
        else {
            earTrainingGame.skipRoot(false);
            earTrainingGame.silentFurtherPunishments.current = true;
        }

        if (noteInput.inputDevice === 'ui' || noteInput.inputDevice === 'keyboard') {
            setMicrophoneCalibrated(true);
        }
    }, [noteInput.inputDevice])


    useGlobalPointer((ev) => {
        if (earTrainingGame.active && !earTrainingGame.isTalking && !isSidebarOpen && !isLevelDropdownOpen)
            earTrainingGame.replayQuestion();
    });


    useEffect(() => {

        if (microphoneCalibrated === false) earTrainingGame.stop();
        if (challengePresented && microphoneCalibrated) {
            earTrainingGame.start();
        }
    }, [challengePresented, microphoneCalibrated])




    return (

        <div className={styles.appContainer}>

            <div className={styles.topBar}>
                {!isSidebarOpen && (
                    <button className={styles.sidebarToggle} onClick={() => setIsSidebarOpen(true)}>
                        ☰
                    </button>
                )}

                {everyThingReady &&
                    <div className={styles.levelDropdown}>
                        <LevelDropdown selectedLevel={earTrainingSettings.level} onChange={earTrainingSettings.setLevel} unlockedLevels={earTrainingSettings.unlockedLevels} onToggle={setIsLevelDropdownOpen} />
                    </div>}

                <span
                    className={`${!earTrainingGame.active ? animation.hide : animation.show} ${styles.score} ${styles[earTrainingGame.targetNotesChannelOutput[earTrainingGame.selectedNoteIndex].style]}`}
                >{`${percentageScore}%`}</span>

            </div>



            <div className={everyThingReady ? styles.centerElement : styles.bottom}>

                {everyThingReady && !challengePresented &&
                    <ChallengePresentation intervals={cachedScale.intervals} direction={cachedDirection} onComplete={setChallengePresented} />
                }

                {everyThingReady && challengePresented &&
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

                {noteInput.inputDevice != 'ui' && noteInput.ready && !microphoneCalibrated &&
                    <Calibration noteInput={noteInput} onDone={setMicrophoneCalibrated} />
                }

                {noteInput.inputDevice != 'ui' && everyThingReady && challengePresented &&
                    <div>
                        <AvailableNotesPanel availableNotes={cachedScale.getDirectionSensitiveIntervals(cachedDirection)} blockedNotes={getIntervalsFromPitch(earTrainingGame.root.pitchClass, earTrainingGame.wrongAnswerList, cachedDirection)} />

                        <div className={styles.inputNotRecognized}>
                            <span>Input not recognized correctly?</span>
                            <button style={{ fontSize: '1em' }} onClick={() =>
                                setMicrophoneCalibrated(false)
                            }>Click here!</button>
                        </div>

                    </div>
                }

                {earTrainingGame.ready && noteInput.ready && challengePresented && noteInput.inputDevice === 'ui' &&
                    <NoteInputButtonGrid intervals={cachedScale.intervals} resetTrigger={earTrainingGame.selectedNoteIndex} noteInput={noteInput} root={earTrainingGame.root.pitchClass} active={!earTrainingGame.isTalking} direction={cachedDirection} />
                }
            </div>



            <div className={styles.lowerLeft}>
                <img className={`${styles.soundIcon} ${earTrainingGame.isTalking ? animation.show : animation.hide}`} src={volumeIcon} alt={"Turn on volume"} />
            </div>

            {noteInput.inputDevice != 'ui' && everyThingReady && challengePresented &&
                <div className={`${styles.lowerRight} ${styles.detectedPitch}`}>
                    <CircledCharacter character={detectedPitchClass ? detectedPitchClass : " "} />
                </div>}

            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />
        </div >
    )

}

export default EarTrainingPage;
