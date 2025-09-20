import React, { use, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import styles from './TitleText.module.css';
import useSequence from '../hooks/useSequence';
import { SequenceStep } from '../hooks/useSequence';


const TitleText: React.FC = () => {

    const sequenceList = [
        { duration: 300, element: 'enter-transition' },
        { duration: 3000, element: 'enter-transition' },
        { duration: 300, element: 'exit-transition' },
        { duration: 200, element: 'return-transition' },

    ];
    const catchWords = ['hear', 'like', 'imagine'];
    const highlightRef = useRef<HTMLSpanElement | null>(null);
    const sequence = useSequence(sequenceList);
    const currentCatchWord = () => catchWords[sequence.iterationCount % catchWords.length].toString()


    const updateWidth = () => {
        if (highlightRef.current) {
            const currentWidth = currentCatchWord().length * 0.5;
            highlightRef.current.style.width = `${currentWidth}em`;
        }
    };

    useLayoutEffect(() => {
        updateWidth();
    }, [sequence.iterationCount]);

    useEffect(() => {
        let timeoutId = 0
        const debouncedUpdate = () => {
            if (highlightRef.current)
                highlightRef.current.style.width = 'auto';
            clearTimeout(timeoutId);
            timeoutId = setTimeout(updateWidth, 150);
        };

        window.addEventListener('resize', debouncedUpdate);

        return () => {
            window.removeEventListener('resize', debouncedUpdate);
            clearTimeout(timeoutId);
        };
    });



    return (
        <div className={styles.titleTextContainer}>
            <h1>Fluent Ear</h1>
            <div className={styles.subtitleContainer}>
                <span className={styles.subtitle}>Play what you </span><span ref={highlightRef} className={`${styles.highlight} ${styles[sequence.currentStep.element.toString()]}`}
                    style={{
                        transition:
                            `transform ${sequence.currentStep.duration / 1000}s ease-in-out, 
                            opacity ${sequence.currentStep.duration / 1000}s ease-in-out,
                             width ${sequence.currentStep.duration / 1000}s ease-in-out`
                    }}>{catchWords[sequence.iterationCount % catchWords.length].toString()}</span>
            </div>

        </div>
    );
};

export default TitleText;
