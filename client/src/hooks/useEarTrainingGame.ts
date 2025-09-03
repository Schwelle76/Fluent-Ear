import { useState, useEffect, useRef, use } from 'react';

import usePitchDetection from './usePitchDetection';
import EarTrainingSettings from '../models/EarTrainingSettings';
import { SCALES } from '../constants/SCALES';
import { Scale } from '../models/Scale';
import SoundfontService from '../services/SoundFontService';
import { Note, PITCH_CLASSES, PitchClass } from '../models/Note';

export default function useEarTrainingGame(detectedNote: PitchClass | undefined, scale: Scale, rootPitch: string, direction: string) {


    const [targetNote, setTargetNote] = useState<Note | undefined>(undefined);
    const [score, setScore] = useState(0);
    const audioPlayerRef = useRef<SoundfontService | null>(null);
    const [active, setActive] = useState(false);
    const rootOctave = 4;
    const [output, setOutput] = useState<string | undefined>(undefined);

    const start = () => {
        setActive(true);
        selectNewTargetNote();
    }

    useEffect(() => {
        audioPlayerRef.current = new SoundfontService();
        audioPlayerRef.current.load();

        return () => {
            audioPlayerRef.current?.destroy();
            audioPlayerRef.current = null;
            setActive(false);
        };
    }, []);


    useEffect(() => {
        if (detectedNote === undefined || output !== undefined) return;
        else if (targetNote?.pitchClass === detectedNote) {
            setScore(score + 1);
            selectNewTargetNote();
            console.log("score: ", score);
        }

    }, [detectedNote]);

    useEffect(() => {
        if (active === true)
            selectNewTargetNote();

    }, [rootPitch, scale, direction])


    function selectNewTargetNote() {

        const absoluteScale = scale.getPitchClasses(rootPitch);
        let nextPitchClass = absoluteScale[0];
        let octave = 4;

        if (absoluteScale.length > 1) {
            const availablePitchClasses = absoluteScale.filter(pitchClass => pitchClass !== targetNote?.pitchClass);
            nextPitchClass = availablePitchClasses[Math.floor(Math.random() * (availablePitchClasses.length))];
        }

        // Calculate octave based on direction and note positions
        const rootPitchIndex = PITCH_CLASSES.indexOf(rootPitch);
        const notePitchIndex = PITCH_CLASSES.indexOf(nextPitchClass);

        if (rootPitchIndex !== -1 && notePitchIndex !== -1) {
            if (direction === 'ascending') {
                octave = notePitchIndex > rootPitchIndex ? 4 : 5;
            } else if (direction === 'descending') {
                octave = notePitchIndex < rootPitchIndex ? 4 : 3;
            } else {
                // Randomly choose between ascending and descending rules
                const useAscending = Math.random() > 0.5;
                octave = useAscending
                    ? (notePitchIndex > rootPitchIndex ? 4 : 5)
                    : (notePitchIndex < rootPitchIndex ? 4 : 3);
            }
        }

        const newTargetNote = new Note(nextPitchClass, octave); ``
        setTargetNote(newTargetNote);

        playNotes(newTargetNote);

    }

    const replayNotes = () => {
        if (targetNote === undefined) { selectNewTargetNote(); return; }
        playNotes(targetNote);
    }

    const playNotes = (nextNote: Note) => {
        setOutput(rootPitch);
        audioPlayerRef.current?.play(rootPitch + rootOctave).then(() => {
            setOutput("?");
            audioPlayerRef.current?.play(nextNote.toString()).then(() => setOutput(undefined));
        });
    }

    return {
        targetNote,
        score,
        replayNotes,
        start,
        active,
        output
    }



}
