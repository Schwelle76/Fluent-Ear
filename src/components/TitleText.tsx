import React, { use, useEffect, useState } from 'react';
import styles from './TitleText.module.css';


const TitleText: React.FC = () => {

    const [currentCatchWordIndex, setCurrentCatchWordIndex] = useState(0);
    const catchWord = ['hear', 'like', 'imagine'];
    const animationDuration = 3000;

    useEffect(() => {
        const timerId = setTimeout(() => {
            if(currentCatchWordIndex < catchWord.length -1)
                setCurrentCatchWordIndex(prevIndex => (prevIndex + 1));
        }, animationDuration);

        return () => clearTimeout(timerId);
    }, [currentCatchWordIndex]);

    console.log(catchWord[currentCatchWordIndex]);

    return (
        <div className={styles.titleTextContainer}>
            <h1>Fluent Ear</h1>
            <p>Play what you <span className= {`${styles.highlight} ${styles[`highlight-animation-${currentCatchWordIndex}`]}`}
            style={{   
                animationDuration: `${animationDuration / 1000}s` }}>{catchWord[currentCatchWordIndex]}</span></p>


        </div>
    );
};

export default TitleText;
