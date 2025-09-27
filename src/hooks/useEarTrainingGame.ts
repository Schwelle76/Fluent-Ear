import { useState, useEffect, useRef, use } from 'react';

import usePitchDetection from './usePitchDetection';
import EarTrainingSettings from '../models/EarTrainingSettings';
import { SCALES } from '../constants/SCALES';
import { Scale } from '../models/Scale';
import SoundfontService from '../services/SoundFontService';
import { getInterval, getPitchClass, isPitchClass, Note, parsePitchClass, PITCH_CLASSES, PitchClass, randomPitchClass } from '../models/Note';
import { Direction } from '../models/Direction';
import { StyledMessage } from '../models/StyledMessage';
import useAudioPlayer from './useAudioPlayer';

export default function useEarTrainingGame(detectedNote: Note | PitchClass | undefined, scale: Scale, rootPitchSetting: string, direction: Direction) {


    const [targetNote, setTargetNote] = useState<Note | undefined>(undefined);
    const [score, setScore] = useState(0);
    const [active, setActive] = useState(false);

    //muss noch mit audioPlayer gesynced werden
    const [ready, setReady] = useState(false);
    const rootOctave = 4;

    const audioPlayer = useAudioPlayer();

    const [rootChannelOutput, setRootChannel] = useState<StyledMessage>({ message: '', style: '' });
    const [targetNotesChannelOutput, setTargetNotesChannels] = useState<StyledMessage[]>([{ message: '', style: '' }]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [root, setRoot] = useState<Note>(pickRoot());

    const start = () => {
        setActive(true);

        setScore(0);


        if (ready === true)
            setNewNotes();
    }

    useEffect(() => {
        return () => {
            setActive(false);
        };
    }, []);

    useEffect(() => {

        if (audioPlayer.ready) setReady(true);
        else setReady(false);


        return () => {
            setReady(false);
        };
    }, [audioPlayer.ready]);


    useEffect(() => {

        if (targetNote === undefined
            || audioPlayer.isPlaying) return;


        let detectedPitchClass = undefined;
        if (detectedNote instanceof Note) {
            detectedPitchClass = detectedNote.pitchClass;
        }
        else detectedPitchClass = detectedNote;


        if (currentQuestionIndex !== -1) {
            setTargetNotesChannels((prev) => {
                return [
                    ...prev.slice(0, currentQuestionIndex),
                    {
                        message: detectedPitchClass ? detectedPitchClass : '?',
                        style: ''
                    },
                    ...prev.slice(currentQuestionIndex + 1)
                ];
            })
        }

        
        if (detectedNote === undefined || detectedNote instanceof Note && detectedNote.equals(root))
            return;


        if (detectedPitchClass == targetNote.pitchClass) {
            setScore(score + 1);
            playReward().then(() => {
                setNewNotes();
            });
        }

    }, [detectedNote]);

    useEffect(() => {
        if (active)
            start();
    }, [rootPitchSetting, scale, direction, ready])


    function pickRoot() {
        return isPitchClass(rootPitchSetting) ? new Note(rootPitchSetting, rootOctave) : new Note(randomPitchClass(), rootOctave);
    }

    function setNewNotes() {


        const newRoot = pickRoot();

        const absoluteScale = scale.getPitchClasses(newRoot.pitchClass);
        let nextPitchClass = absoluteScale[0];
        let octave = newRoot.octave;

        if (absoluteScale.length > 1) {
            const availablePitchClasses = absoluteScale.filter(pitchClass => pitchClass !== targetNote?.pitchClass);
            nextPitchClass = availablePitchClasses[Math.floor(Math.random() * (availablePitchClasses.length))];
        }

        const rootPitchIndex = PITCH_CLASSES.indexOf(newRoot.pitchClass);
        const notePitchIndex = PITCH_CLASSES.indexOf(nextPitchClass);

        if (rootPitchIndex !== -1 && notePitchIndex !== -1) {
            if (direction === 'ascending') {
                octave = notePitchIndex > rootPitchIndex ? newRoot.octave : newRoot.octave + 1;
            } else if (direction === 'descending') {
                octave = notePitchIndex < rootPitchIndex ? newRoot.octave : newRoot.octave - 1;
            } else {
                const useAscending = Math.random() > 0.5;
                octave = useAscending
                    ? (notePitchIndex > rootPitchIndex ? newRoot.octave : newRoot.octave + 1)
                    : (notePitchIndex < rootPitchIndex ? newRoot.octave : newRoot.octave - 1);
            }
        }

        const newTargetNote = new Note(nextPitchClass, octave); ``
        setTargetNote(newTargetNote);
        setRoot(newRoot);
        setCurrentQuestionIndex(0);

        playQuestion(newRoot, newTargetNote);

    }

    const replayQuestion = () => {
        if (targetNote === undefined) { setNewNotes(); return; }
        playQuestion(root, targetNote);
    }

    const playQuestion = async (rootNote: Note, nextNote: Note) => {

        setRootChannel({ message: rootNote.pitchClass, style: "pulse" });
        audioPlayer.play(rootNote.toString()).then(() => {

            setRootChannel({ message: rootNote.pitchClass, style: '' });
            setTargetNotesChannels([{ message: "?", style: "pulse" }]);
            audioPlayer.play(nextNote.toString()).then(() => {
                setTargetNotesChannels([{ message: "?", style: '' }]);
            }
            );
        });
    }

    const playReward = async () => {


        return new Promise((resolve) => {
            if (targetNote) {

                setTargetNotesChannels([{ message: targetNote.pitchClass, style: "reward" }]);

                const rewardNotes: string[] = [];
                const RewardInterval = getPitchClass(targetNote.pitchClass, "1");

                rewardNotes.push(targetNote.pitchClass + 5);
                if (RewardInterval)
                    rewardNotes.push(RewardInterval + 6);

                audioPlayer.play(rewardNotes[0], .2, .5);
                setTimeout(() => {
                    audioPlayer.play(rewardNotes[1].toString(), .4, .4).then(() => {
                        setTargetNotesChannels([{ message: targetNote.pitchClass, style: '' }]);
                        resolve(true)
                    });

                }, 130);
            } else resolve(false);
        })
    }

    return {
        targetNote,
        score,
        replayQuestion,
        start,
        active,
        ready,
        isTalking: audioPlayer.isPlaying,
        rootChannelOutput,
        targetNotesChannelOutput,
        root
    }



}
