import { useState, useEffect, useRef } from 'react';
import NoteFromKeyboardDetector from '../services/NoteFromKeyboardDetector';
import { PitchClass } from '../models/Note';
import MicrophoneNoteDetector from '../services/MicrophoneNoteDetector';

export default function useNoteInput() {

    const [inputDevice, setInputDevice] = useState<'keyboard' | 'microphone'>('microphone');

    const microphoneNoteDetector = useRef<MicrophoneNoteDetector | undefined>(undefined);
    const noteFromKeyboardDetector = useRef<NoteFromKeyboardDetector | undefined>(undefined);

    const [note, setNote] = useState<PitchClass | undefined>(undefined);
    const [ready, setReady] = useState(false);
    const [sensitivity, setSensitivity] = useState(0);


    useEffect(() => {

        if (inputDevice === "microphone") {
            microphoneNoteDetector.current = new MicrophoneNoteDetector(setNote);
            setSensitivity(microphoneNoteDetector.current.sensitivity);
        }

        if (inputDevice === "keyboard") {
            noteFromKeyboardDetector.current = new NoteFromKeyboardDetector(setNote);
            setReady(true);
        }

        return () => {
            microphoneNoteDetector.current?.destroy();
            noteFromKeyboardDetector.current?.destroy();
        }
    }, []);


    useEffect(() => {
        microphoneNoteDetector.current?.setSensitivity(sensitivity);
    }, [sensitivity]);



    const initialize = async () => {

        if (inputDevice === "microphone") {
            let success = await microphoneNoteDetector.current?.initAudio();
            setReady(success ?? false);
        }
    }

    return {
        note,
        setSensitivity,
        sensitivity,
        MAX_SENSITIVITY: microphoneNoteDetector.current?.MAX_SENSITIVITY ?? 100,
        MIN_SENSITIVITY: microphoneNoteDetector.current?.MIN_SENSITIVITY ?? 1,
        ready,
        initialize,
        inputDevice
    };
}
