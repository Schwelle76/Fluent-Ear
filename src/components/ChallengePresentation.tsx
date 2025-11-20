import React from 'react';
import { Direction } from '../models/Direction';
import styles from './ChallengePresentation.module.css';

interface ChallengePresentationProps {
    intervals: string[];
    direction: Direction;
    onComplete: (complet: boolean) => void;
}

const ChallengePresentation : React.FC<ChallengePresentationProps> = ({ intervals, direction, onComplete }) => {

    let directionText = 'above or below';
    let showRoot = intervals.includes('1');
    let showOctave = intervals.includes('1');

    if(direction === 'ascending'){ 
        showRoot = false;
        directionText = 'above';
    }
    else if(direction === 'descending'){
        showOctave = false;
        directionText = 'below';
    }


    return (
        <div>
            <br />
            <hr />
            <span className={styles.instructionText}>Identify the Intervals</span>
            <br />
            <br />
            <div className={styles.intervalContainer}>
                {showRoot && <span>1</span>}
                {intervals.map((interval, index) => (
                    interval !== '1' &&
                    <span key={index}>{interval}</span>
                ))}
                {showOctave && <span>8</span>}
            </div>
            <br />
            <span className={styles.instructionText}><strong>{directionText}</strong> the root</span>
            <hr />
            <button className={styles.button} onClick={() => onComplete(true)}>Start</button>
        </div>
    )
}

export default ChallengePresentation;