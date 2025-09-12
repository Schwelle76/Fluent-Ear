import React from 'react';
import styles from './EntryPage.module.css';
import useNoteInput from '../../hooks/useNoteInput';
import useEarTrainingGame from '../../hooks/useEarTrainingGame';
import InputOption from '../../components/InputOption';
import TitleText from '../TitleText';
import { InputDevice } from '../../models/InputDevice';

interface EntryPageProps {
  noteInput: ReturnType<typeof useNoteInput>;
}

const EntryPage: React.FC<EntryPageProps> = ({ noteInput}) => {

  function setInputDevice(InputDevice: InputDevice) {
    noteInput.setInputDevice(InputDevice);
  }

  return (

    <div className={styles.entryPage}>

      {!noteInput.inputDevice && <div className={styles.titleTextContainer}>
        <TitleText />
      </div>}


      {!noteInput.inputDevice && <div className={styles.inputOptionsContainerFlexboxContainer}>
        <p>Select your Input</p>
        <div className={styles.inputOptionsContainerFlexbox}>
          <div className={styles.inputOptionContainer}>
            <div className={styles.inputOption}>
              <InputOption
                imageSrc="./src/assets/touch-press-click.svg"
                label="Touch"
                onClick={() => {
                  setInputDevice("keyboard");
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
      </div>}
    </div>
  );
};

export default EntryPage;
