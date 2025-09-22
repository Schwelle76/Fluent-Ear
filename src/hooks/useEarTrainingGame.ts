import { useState, useEffect, useRef, use } from 'react';

import usePitchDetection from './usePitchDetection';
import EarTrainingSettings from '../models/EarTrainingSettings';
import { SCALES } from '../constants/SCALES';
import { Scale } from '../models/Scale';
import SoundfontService from '../services/SoundFontService';
import { getInterval, getPitchClass, Note, parsePitchClass, PITCH_CLASSES, PitchClass } from '../models/Note';
import { Direction } from '../models/Direction';
import { StyledMessage } from '../models/StyledMessage';

export default function useEarTrainingGame(detectedNote: PitchClass | undefined, scale: Scale, rootPitchSetting: string, direction: Direction) {


    const [targetNote, setTargetNote] = useState<Note | undefined>(undefined);
    const [score, setScore] = useState(0);
    const audioPlayerRef = useRef<SoundfontService | null>(null);
    const [active, setActive] = useState(false);
    const [ready, setReady] = useState(false);
    const rootOctave = 4;
    const [output, setOutput] = useState<string | undefined>(undefined);

    const [messageChannels, setMessageChannels] = useState<string[]>([]);
    const [rootChannelOutput, setRootChannel] = useState<StyledMessage>({message: '', style: ''});
    const [targetNotesChannelOutput, setTargetNotesChannels] = useState<StyledMessage[]>([{message: '', style: ''}]);
    const [root, setRoot] = useState<PitchClass>(parsePitchClass(rootPitchSetting) ?? PITCH_CLASSES[Math.floor(Math.random() * PITCH_CLASSES.length)]);
    const [isTalking, setIsTalking] = useState(false);

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
        if (detectedNote === undefined || output !== undefined) return;
        else if (targetNote?.pitchClass === detectedNote) {
            setScore(score + 1);
            playReward().then(() => {
                selectNewTargetNote();
            });
        }

    }, [detectedNote]);

    useEffect(() => {
        setRoot(parsePitchClass(rootPitchSetting) ?? PITCH_CLASSES[Math.floor(Math.random() * PITCH_CLASSES.length)]);
        setScore(0);

        if (active === true && ready === true)
            selectNewTargetNote();

    }, [rootPitchSetting, scale, direction, active, ready])


    function selectNewTargetNote() {

        const absoluteScale = scale.getPitchClasses(rootPitchSetting);
        let nextPitchClass = absoluteScale[0];
        let octave = 4;

        if (absoluteScale.length > 1) {
            const availablePitchClasses = absoluteScale.filter(pitchClass => pitchClass !== targetNote?.pitchClass);
            nextPitchClass = availablePitchClasses[Math.floor(Math.random() * (availablePitchClasses.length))];
        }

        const rootPitchIndex = PITCH_CLASSES.indexOf(root);
        const notePitchIndex = PITCH_CLASSES.indexOf(nextPitchClass);

        if (rootPitchIndex !== -1 && notePitchIndex !== -1) {
            if (direction === 'ascending') {
                octave = notePitchIndex > rootPitchIndex ? 4 : 5;
            } else if (direction === 'descending') {
                octave = notePitchIndex < rootPitchIndex ? 4 : 3;
            } else {
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

    const playNotes = async (nextNote: Note) => {
        setRootChannel({ message: root, style: "pulse" });
        setIsTalking(true);
        setOutput(rootPitchSetting);
        audioPlayerRef.current?.play(rootPitchSetting + rootOctave).then(() => {

            setRootChannel({ message: root, style: '' });
            setTargetNotesChannels([{ message: "?", style: "pulse" }]);
            setOutput("?");
            audioPlayerRef.current?.play(nextNote.toString()).then(() => {

                setTargetNotesChannels([{ message: "?", style: '' }]);
                setIsTalking(false);
                setOutput(undefined)
            }
            );
        });
    }

    const playReward = async () => {


        return new Promise((resolve) => {
            if (targetNote) {

                setTargetNotesChannels([{ message: targetNote.pitchClass, style: "reward" }]);
                setOutput(targetNote.pitchClass)
                setIsTalking(true);

                const rewardNotes: string[] = [];
                const fifthInterval = getPitchClass(targetNote.pitchClass, "5");

                rewardNotes.push(targetNote.pitchClass + 3);
                if (fifthInterval)
                    rewardNotes.push(fifthInterval + 5);

                audioPlayerRef.current?.play(rewardNotes, .65, .5).then(() => {
                    setOutput(undefined);
                    setTargetNotesChannels([{ message: targetNote.pitchClass, style: ''}]);
                    setIsTalking(false);
                    resolve(true)
                });
            } else resolve(false);
        })
    }

    return {
        targetNote,
        score,
        replayNotes,
        start,
        active,
        output,
        isTalking,
        rootChannelOutput,
        targetNotesChannelOutput,
        root
    }



}
