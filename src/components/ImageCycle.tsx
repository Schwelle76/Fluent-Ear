import React, { useEffect, useState } from 'react';
import styles from './ImageCycle.module.css';

interface ImageCyclerProps {
    imageSrcs: string[];
    alt: string;
    fadeDuration: number;
    displayDuration: number;
}

const ImageCycler: React.FC<ImageCyclerProps> = ({ imageSrcs, alt, fadeDuration, displayDuration }) => {

    const animationStates = [
        {
            name: "fadeIn",
            duration: fadeDuration,
        },
        {
            name: "fullOpacity",
            duration: displayDuration,
        },
        {
            name: "fadeOut",
            duration: fadeDuration,
        }
    ]


    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [currentAnimationState, setCurrentAnimationState] = useState<number>(1);


    if (!imageSrcs || imageSrcs.length === 0) {
        return null;
    }

    useEffect(() => {

        const timerId = setTimeout(() => {
            const nextState = (currentAnimationState + 1) % animationStates.length;
            setCurrentAnimationState(nextState);
            
            if (nextState === 0) {
                setCurrentImageIndex(prevIndex => (prevIndex + 1) % imageSrcs.length);
            }


        }, animationStates[currentAnimationState].duration);

        return () => clearTimeout(timerId);
    }, [imageSrcs.length, fadeDuration, displayDuration, currentAnimationState]);


    return (
        <div className={styles.imageContainer}>

            {imageSrcs.map((imageSrc, index) => {

                return (
                    <img
                        key={index}
                        src={imageSrc}
                        alt={alt}
                        className={index === currentImageIndex ? styles[animationStates[currentAnimationState].name] : styles.invisible}
                        style={{
                            animationDuration: `${animationStates[currentAnimationState].duration / 1000}s`,
                        }} />
                );
            })}
        </div>
    );
};

export default ImageCycler;
