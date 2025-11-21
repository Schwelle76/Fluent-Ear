import { useState, useEffect, useRef, use } from 'react';
import { Scale } from '../models/Scale';
import { getPitchClass, isPitchClass, Note, PITCH_CLASSES, PitchClass, randomPitchClass } from '../models/Note';
import { Direction } from '../models/Direction';
import { StyledNote } from '../models/StyledMessage';
import useAudioPlayer from './useAudioPlayer';

export default function useEarTrainingGame(detectedNote: Note | PitchClass | undefined, scale: Scale, rootPitchSetting: string, direction: Direction, melodyLength: number) {


    const [notes, setNotes] = useState<Note[]>([]);
    const [score, setScore] = useState(parseInt(localStorage.getItem('score') || '0') || 0);
    const [correctNotesCount, setCorrectNotesCount] = useState(0);
    const [awaitingStart, setAwaitingStart] = useState(false);

    const [ready, setReady] = useState(false);
    const defaultOctave = 4;

    const audioPlayer = useAudioPlayer();

    const [targetNotesChannelOutput, setTargetNotesChannels] = useState<StyledNote[]>(Array.from({ length: melodyLength + 1 }, () => ({ note: null, style: '' })));
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1);
    const [selectedNoteIndex, setSelectedNoteIndex] = useState(0);
    const [startQuestionIndex, setStartQuestionIndex] = useState(0);
    const [root, setRoot] = useState<Note>(pickRoot());
    const userRootOctaveRef = useRef<number>(defaultOctave);
    const startCount = useRef(0);
    const [active, setActive] = useState(false);

    const maxScore = 15;
    const stopOnMaxScore = useRef(false);
    const [totalAnswersCount, setTotalAnswersCount] = useState(0);
    const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
    const [wrongAnswerList, setWrongAnswerList] = useState<PitchClass[]>([]);

    function skipRoot(boolean: boolean) {

        const startQuestionIndexValue = boolean ? 1 : 0;
        setStartQuestionIndex(startQuestionIndexValue);
    }

    function updateScore(add: number) {
        setScore((prev) => Math.max(Math.min(prev + add, maxScore), 0));
        setTotalAnswersCount((prev) => prev + 1);

        if (add > 0) setCorrectAnswersCount((prev) => prev + add);
    }

    useEffect(() => {
        localStorage.setItem('score', score.toString());
    }, [score]);

    const start = () => {

        setAwaitingStart(true);
        setCurrentQuestionIndex(1);

        if (ready === true) {

            if (startCount.current > 0) {
                setScore(0);
                setTotalAnswersCount(0);
            }

            startCount.current++;
            setActive(true);
            setAwaitingStart(false);
            setNewNotes();
        }
    }

    const stop = () => {
        setActive(false);
        setAwaitingStart(false);
    }


    useEffect(() => {
        return () => {
            setAwaitingStart(false);
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
        setWrongAnswerList([]);
    }, [selectedNoteIndex])

    useEffect(() => {

        if (notes.length === 0
            || audioPlayer.isPlaying || active === false) return;


        let detectedNoteIsRoot = false;

        let detectedPitchClass = undefined;
        if (detectedNote instanceof Note) {
            detectedPitchClass = detectedNote.pitchClass;

            if (detectedNote.pitchClass === root.pitchClass && detectedNote.octave === userRootOctaveRef.current) {
                detectedNoteIsRoot = true;
                setSelectedNoteIndex(1);
                audioPlayer.play(root.toString());
                return;
            }

        }
        else detectedPitchClass = detectedNote;



        if (detectedNote === undefined || detectedPitchClass === undefined)
            return;


        if (detectedPitchClass === notes[selectedNoteIndex].pitchClass) {

            setTargetNotesChannels((prev) =>
                [
                    ...prev.slice(0, selectedNoteIndex),
                    { note: notes[selectedNoteIndex], style: "reward" },
                    ...prev.slice(selectedNoteIndex + 1, prev.length)
                ]
            );

            setCorrectNotesCount(prev => prev + 1);


            let maxScoreReached = false;
            if (selectedNoteIndex >= currentQuestionIndex) {
                setCurrentQuestionIndex(prev => prev + 1);
                updateScore(1);

                if (score + 1 >= maxScore) {
                    maxScoreReached = true;
                }
            }

            if (selectedNoteIndex < notes.length - 1) {
                if (selectedNoteIndex === 0 && detectedNote instanceof Note) {
                    userRootOctaveRef.current = detectedNote.octave;
                }


                setSelectedNoteIndex(prev => prev + 1);


                audioPlayer.play(notes[selectedNoteIndex].toString());
            }
            else {
                setCurrentQuestionIndex(1);
                audioPlayer.play(notes[selectedNoteIndex].toString()).then(() => {
                    playReward().then(() => {
                        setSelectedNoteIndex(0);

                        if (maxScoreReached && stopOnMaxScore.current)
                            setActive(false);
                        else setNewNotes();
                    });
                });
            }
        } else {
            if (selectedNoteIndex > 0
                && !detectedNoteIsRoot && !wrongAnswerList.includes(detectedPitchClass)
                && scale.getPitchClasses(root.pitchClass).includes(detectedPitchClass)) {
                setWrongAnswerList((prev) => [...prev, detectedPitchClass]);

                if (currentQuestionIndex === selectedNoteIndex) {
                    playPunishment(false, selectedNoteIndex);
                    updateScore(-1);
                    setCurrentQuestionIndex(prev => prev + 1);
                }
                else {
                    playPunishment(true, selectedNoteIndex);
                }

            }
        }

    }, [detectedNote]);


    useEffect(() => {
        if (awaitingStart)
            start();
    }, [ready])


    function pickRoot() {
        return isPitchClass(rootPitchSetting) ? new Note(rootPitchSetting, defaultOctave) : new Note(randomPitchClass(), defaultOctave);
    }

    async function setNewNotes() {

        const newRoot = pickRoot();

        const absoluteScale = scale.getPitchClasses(newRoot.pitchClass);

        const newTargetNotes: Note[] = [];

        let channelOutput: StyledNote[] = [];

        channelOutput.push({ note: newRoot, style: '' });
        for (let i = 0; i < melodyLength; i++)
            channelOutput.push({ note: null, style: '' });
        setTargetNotesChannels(channelOutput);

        for (let i = 0; i < melodyLength; i++) {
            let nextPitchClass = absoluteScale[0];
            let octave = newRoot.octave;

            if (absoluteScale.length > 1) {
                const availablePitchClasses = absoluteScale.filter(pitchClass => pitchClass !== notes[currentQuestionIndex]?.pitchClass);
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

            newTargetNotes.push(new Note(nextPitchClass, octave));
        }


        const newNotes = [newRoot, ...newTargetNotes];
        setNotes(newNotes);
        setRoot(newRoot);
        setWrongAnswerList([]);


        await replayQuestion(newNotes);


    }

    const replayQuestion = async (melody: Note[] = notes) => {

        if (melody.length === 0) { setNewNotes(); return; }
        await playMelody(melody);
        await setTimeout(() => {
            playMelody(melody, 0, startQuestionIndex).then(() => {
                setSelectedNoteIndex(startQuestionIndex);
            }
            );
        }, 300);
    }

    const playMelody = async (notes: Note[], start = 0, end = notes.length) => {


        for (let i = start; i < end; i++) {


            setTargetNotesChannels((prev) => [
                ...prev.slice(0, i),
                { note: prev[i].note, style: "pulse" },
                ...prev.slice(i + 1, prev.length)
            ]);

            await audioPlayer.play(notes[i].toString());

            setTargetNotesChannels((prev) => [
                ...prev.slice(0, i),
                { note: prev[i].note, style: '' },
                ...prev.slice(i + 1, prev.length)]

            )
        }

    }

    const playPunishment = async (silent = false, noteIndex: number) => {

        return new Promise((resolve) => {

            if (notes.length > 0 && noteIndex < notes.length) {

                setTargetNotesChannels((prev) => [
                    ...prev.slice(0, noteIndex),
                    { note: prev[noteIndex].note, style: "punishment" },
                    ...prev.slice(noteIndex + 1, prev.length)
                ]
                );


                if (silent) {
                    setTimeout(() => {

                        setTargetNotesChannels((prev) => {
                            if (prev[noteIndex]?.style === 'punishment')
                                return [
                                    ...prev.slice(0, noteIndex),
                                    { note: prev[noteIndex].note, style: "" },
                                    ...prev.slice(noteIndex + 1, prev.length)
                                ]
                            else return prev;

                        });
                    }, 300)
                    resolve(true);
                    return;
                }

                const punishmentNotes: string[] = [];
                const punishmentInterval = getPitchClass(notes[noteIndex].pitchClass, "b5");

                punishmentNotes.push(root.pitchClass + 4);
                if (punishmentInterval)
                    punishmentNotes.push(punishmentInterval + 3);

                audioPlayer.play(punishmentNotes[0], .2, .5);
                setTimeout(() => {
                    audioPlayer.play(punishmentNotes[1].toString(), .4, .4).then(() => {
                        setTargetNotesChannels((prev) =>
                            [
                                ...prev.slice(0, noteIndex),
                                { note: prev[noteIndex].note, style: "" },
                                ...prev.slice(noteIndex + 1, prev.length)
                            ]
                        );
                        resolve(true)
                    });

                }, 130);
            } else resolve(false);
        })
    }

    const playReward = async () => {


        return new Promise((resolve) => {
            if (notes.length > 0 && currentQuestionIndex < notes.length) {



                setTargetNotesChannels(notes.map((note) => ({ note: note, style: "reward" })));

                const rewardNotes: string[] = [];
                const RewardInterval = getPitchClass(notes[currentQuestionIndex].pitchClass, "1");

                rewardNotes.push(notes[currentQuestionIndex].pitchClass + 5);
                if (RewardInterval)
                    rewardNotes.push(RewardInterval + 6);

                audioPlayer.play(rewardNotes[0], .2, .5);
                setTimeout(() => {
                    audioPlayer.play(rewardNotes[1].toString(), .4, .4).then(() => {
                        setTargetNotesChannels(notes.map((note) => ({ note: note, style: "" })));
                        resolve(true)
                    });

                }, 130);
            } else resolve(false);
        })
    }

    return {
        score,
        replayQuestion,
        start,
        stop,
        active,
        ready,
        isTalking: audioPlayer.isPlaying,
        targetNotesChannelOutput,
        currentQuestionIndex,
        selectedNoteIndex,
        correctNotesCount,
        root,
        skipRoot,
        maxScore,
        totalAnswersCount,
        correctAnswersCount,
        stopOnMaxScore,
        wrongAnswerList

    }



}
