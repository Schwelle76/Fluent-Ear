import React from 'react';
import styles from './InputOption.module.css';

interface InputOptionProps {
  imageSrc: string;
  label: string;
  onClick: () => void;
}

const InputOption: React.FC<InputOptionProps> = ({ imageSrc, label, onClick }) => {
  return (
    <button className= {styles.inputOption} onClick={onClick}>
      <img src={imageSrc} alt={label} className={styles.inputOptionImage} />
    </button>
  );
};

export default InputOption;
