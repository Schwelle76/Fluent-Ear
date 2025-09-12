import React from 'react';
import styles from './TitleText.module.css';


const TitleText: React.FC = () => {
    return (
        <div className={styles.titleTextContainer}>
            <h1>Fluent Ear</h1>
            <p>Play what you <span className={styles.highlight}>Imagine</span></p>
        </div>
    );
};

export default TitleText;
