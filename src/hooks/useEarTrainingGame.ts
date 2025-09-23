import { useState, useEffect, useRef, use } from 'react';

import usePitchDetection from './usePitchDetection';
import EarTrainingSettings from '../models/EarTrainingSettings';
import { SCALES } from '../constants/SCALES';
import { Scale } from '../models/Scale';
import SoundfontService from '../services/SoundFontService';
import { getInterval, getPitchClass, isPitchClass, Note, parsePitchClass, PITCH_CLASSES, PitchClass, randomPitchClass } from '../models/Note';
import { Direction } from '../models/Direction';
import { StyledMessage } from '../models/StyledMessage';

export default function useEarTrainingGame(detectedNote: Note | PitchClass | undefined, scale: Scale, rootPitchSetting: string, direction: Direction) {


    const [targetNote, setTargetNote] = useState<Note | undefined>(undefined);
    const [score, setScore] = useState(0);
    const audioPlayerRef = useRef<SoundfontService | null>(null);
    const [active, setActive] = useState(false);
    const [ready, setReady] = useState(false);
    const rootOctave = 4;

    const [rootChannelOutput, setRootChannel] = useState<StyledMessage>({ message: '', style: '' });
    const [targetNotesChannelOutput, setTargetNotesChannels] = useState<StyledMessage[]>([{ message: '', style: '' }]);
    const [root, setRoot] = useState<Note>(pickRoot());
    const [isTalking, setIsTalking] = useState(false);
    const isTalkingBuffer = 200;

    const start = () => {
        setActive(true);
    }

    useEffect(() => {
        audioPlayerRef.current = new SoundfontService();
        audioPlayerRef.current.load().then(() => { setReady(true); });

        return () => {
            audioPlayerRef.current?.destroy();
            audioPlayerRef.current = null;
            setActive(false);
            setReady(false);
        };
    }, []);

    useEffect(() => {
        console.log("isTalking: ", isTalking);
        //if (isTalking) setTimeout(() => setIsTalking(false), isTalkingBuffer);
    }, [isTalking]);
    useEffect(() => {

        if (detectedNote === undefined || targetNote === undefined
            || isTalking) return;


        let detectedPitchClass;
        if (detectedNote instanceof Note) {
            if (detectedNote.equals(root)) return;
            detectedPitchClass = detectedNote.pitchClass;
        }
        else detectedPitchClass = detectedNote;

        if (detectedPitchClass == targetNote.pitchClass) {
            setScore(score + 1);
            playReward().then(() => {
                setNewNotes();
            });
        }

    }, [detectedNote]);

    useEffect(() => {
        setScore(0);

        if (active === true && ready === true)
            setNewNotes();

    }, [rootPitchSetting, scale, direction, active, ready])


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

        playQuestion(newRoot, newTargetNote);

    }

    const replayQuestion = () => {
        if (targetNote === undefined) { setNewNotes(); return; }
            playQuestion(root, targetNote);
    }

    const playQuestion = async (rootNote : Note, nextNote: Note) => {
        setRootChannel({ message: rootNote.pitchClass, style: "pulse" });
        setIsTalking(true);
        audioPlayerRef.current?.play(rootNote.toString()).then(() => {

            setRootChannel({ message: rootNote.pitchClass, style: '' });
            setTargetNotesChannels([{ message: "?", style: "pulse" }]);
            audioPlayerRef.current?.play(nextNote.toString()).then(() => {

                setTargetNotesChannels([{ message: "?", style: '' }]);
                setIsTalking(false);
            }
            );
        });
    }

    const playReward = async () => {


        return new Promise((resolve) => {
            if (targetNote) {

                setTargetNotesChannels([{ message: targetNote.pitchClass, style: "reward" }]);
                setIsTalking(true);

                const rewardNotes: string[] = [];
                const fifthInterval = getPitchClass(targetNote.pitchClass, "5");

                rewardNotes.push(targetNote.pitchClass + 3);
                if (fifthInterval)
                    rewardNotes.push(fifthInterval + 5);

                audioPlayerRef.current?.play(rewardNotes, .65, .5).then(() => {
                    setTargetNotesChannels([{ message: targetNote.pitchClass, style: '' }]);
                    setIsTalking(false);
                    resolve(true)
                });
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
        isTalking,
        rootChannelOutput,
        targetNotesChannelOutput,
        root
    }



}
