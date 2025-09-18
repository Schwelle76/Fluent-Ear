import React from 'react';
import styles from './InputSelection.module.css';
import InputOption from './InputOption';
import useNoteInput from '../hooks/useNoteInput';
import {InputDevice} from '../models/InputDevice';
interface InputSelectionProps {
    noteInput: ReturnType<typeof useNoteInput>;
}

const InputSelection: React.FC<InputSelectionProps> = ({ noteInput }) => {

    function setInputDevice(InputDevice: InputDevice) {
        noteInput.setInputDevice(InputDevice);
    }

    return (

        <div>
            <p className={styles.selectInputPrompt}>Select your Input</p>
            <div className={styles.inputOptionsContainerFlexbox}>
                <div className={styles.inputOptionContainer}>
                    <div className={styles.inputOption}>
                        <InputOption
                            imageSrc="./src/assets/touch-press-click.svg"
                            label="Touch"
                            onClick={() => {
                                setInputDevice("ui");
                            }}
                        />
                    </div>
                    <p>Touch</p>
                </div>
                <div className={styles.inputOptionContainer}>
                    <div className={styles.inputOption}>
                        <InputOption
                            imageSrc="./src/assets/piano.svg"
                            label="Your instrument"
                            onClick={() => {
                                setInputDevice("microphone");
                            }}
                        />
                    </div>
                    <p>Your instrument</p>
                </div>
            </div>
        </div>

    );
};
export default InputSelection;