import { useState, useEffect, useMemo } from 'react';


export interface SequenceStep {
    duration: number;
    element: any;
}

export default function useSequence(sequence: SequenceStep[], isLooping: boolean = true) {

    const [iterationCount, setIterationCount] = useState(0);
    const [sequenceIndex, setSequenceIndex] = useState(0);

    const currentStep = sequence[sequenceIndex];

    useEffect(() => {

        let timerId: ReturnType<typeof setTimeout> | undefined;

        if(currentStep.duration < 0)
            return;
        if (currentStep.duration === 0) 
            nextStep()
        else timerId = setTimeout(() => nextStep(), currentStep.duration);

        return () => clearTimeout(timerId);
    }, [sequenceIndex, currentStep.duration, sequence.length, isLooping]);


    const nextStep = () => {
        const nextSequenceIndex = (sequenceIndex + 1) % sequence.length;

        if (nextSequenceIndex === 0) {
            setIterationCount(prevCount => {
                if (!isLooping && prevCount + 1 > 0) {
                    return prevCount;
                }
                return prevCount + 1;
            });
        }

        setSequenceIndex(nextSequenceIndex);
    }

    return {currentStep, sequenceIndex, iterationCount };
}
