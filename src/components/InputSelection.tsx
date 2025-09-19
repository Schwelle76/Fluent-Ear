import React from 'react';
import styles from './InputSelection.module.css';
import InputOption from './InputOption';
import useNoteInput from '../hooks/useNoteInput';
import { InputDevice } from '../models/InputDevice';
import ImageCycler from './ImageCycle';
interface InputSelectionProps {
    noteInput: ReturnType<typeof useNoteInput>;
}

const InputSelection: React.FC<InputSelectionProps> = ({ noteInput }) => {

    const usesMouse = window.matchMedia('(hover: hover)').matches;


    function setInputDevice(InputDevice: InputDevice) {
        noteInput.setInputDevice(InputDevice);
    }

    return (

        <div>
            <p className={styles.selectInputPrompt}>Select your input device</p>
            <div className={styles.inputOptionsContainerFlexbox}>
                <div className={styles.inputOptionContainer}>
                    <button className={styles.inputOption} onClick={() => {
                        setInputDevice("ui");
                    }}>
                        {usesMouse ?
                            <img src={"./src/assets/mouse-pointer-click.svg"} alt={"Mouse"} className={styles.inputOptionImage} />
                            : <img src={"./src/assets/touch-press-click.svg"} alt={"Touch"} className={styles.inputOptionImage} />
                        }
                    </button>
                    {usesMouse ?
                        <p>Mouse</p>: <p>Touch</p>}
                </div>
                <div className={styles.inputOptionContainer}>
                    <button className={styles.inputOption} onClick={() => {
                        setInputDevice("microphone");
                    }}>
                        <ImageCycler imageSrcs={["./src/assets/guitar.svg", "./src/assets/piano.svg", "./src/assets/saxophone.svg"]} alt={"Your instrument"} fadeDuration={1000} displayDuration={2500} />
                    </button>
                    <p>Your instrument</p>
                </div>
            </div>
        </div>

    );
};
export default InputSelection;