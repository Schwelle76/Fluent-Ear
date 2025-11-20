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


const EarTrainingPage: React.FC = () => {

    const earTrainingSettings = useEarTrainingSettingsContext()
    const noteInput = useNoteInput()
    const [customMelodyLength, setCachedMelodyLength] = useState(earTrainingSettings.melodyLength);
    const [customScale, setCachedScale] = useState(earTrainingSettings.scale);
    const [customRoot, setCachedRoot] = useState(earTrainingSettings.root);
    const [customDirection, setCachedDirection] = useState(earTrainingSettings.direction);


    const earTrainingGame = useEarTrainingGame(noteInput.note, customScale, customRoot, customDirection, customMelodyLength);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [isLevelDropdownOpen, setIsLevelDropdownOpen] = useState(false)

    const [microphoneCalibrated, setMicrophoneCalibrated] = useState(false);
    const [challengePresented, setChallengePresented] = useState(false);


    const score = earTrainingGame.score;
    const percentageScore = Math.round((score / earTrainingGame.maxScore) * 100);
    if (earTrainingSettings.level >= 0) earTrainingGame.stopOnMaxScore.current = true;
    else earTrainingGame.stopOnMaxScore.current = false;

    const everyThingReady: boolean = noteInput.inputDevice != undefined && earTrainingGame.ready && noteInput.ready && microphoneCalibrated;



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

        if (challengePresented) {
            earTrainingGame.start();
        }
    }, [challengePresented])


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
                    className={`${!earTrainingGame.active ? animation.hide : animation.show} ${styles.score} ${styles[earTrainingGame.targetNotesChannelOutput[earTrainingGame.currentQuestionIndex].style]}`}
                >{`${percentageScore}%`}</span>

            </div>



            <div className={everyThingReady ? styles.centerElement : styles.bottom}>

                {everyThingReady && !challengePresented &&
                    <ChallengePresentation intervals={customScale.intervals} direction={customDirection} onComplete={setChallengePresented} />
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
                    <NoteInputPanel noteInput={noteInput} />
                }

                {earTrainingGame.ready && noteInput.ready && challengePresented && noteInput.inputDevice === 'ui' &&
                    <NoteInputButtonGrid intervals={customScale.intervals} resetTrigger={earTrainingGame.selectedNoteIndex} noteInput={noteInput} root={earTrainingGame.root.pitchClass} active={!earTrainingGame.isTalking} direction={customDirection} />}

            </div>



            <div className={styles.lowerLeft}>
                <img className={`${styles.soundIcon} ${earTrainingGame.isTalking ? animation.show : animation.hide}`} src={volumeIcon} alt={"Turn on volume"} />
            </div>

            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />
        </div >
    )

}

export default EarTrainingPage;
