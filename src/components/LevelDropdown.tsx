import React from 'react';
import styles from './LevelDropdown.module.css';
import {Level, LEVELS} from '../constants/LEVELS';


interface LevelDropdownProps {
    selectedLevel: Level  | undefined;
    onChange: (level: Level | undefined) => void;
}

const LevelDropdown : React.FC<LevelDropdownProps> = ({selectedLevel, onChange}) => {


    const levelIndex = selectedLevel ? LEVELS.indexOf(selectedLevel) : undefined;


    return (
        <div>
            <select value= {levelIndex ? levelIndex : 'custom'} onChange={(e) => onChange(e.target.value === 'custom' ? undefined : LEVELS[+e.target.value])
            }>
                <option key = 'custom' value={undefined}>Custom Level</option>
                {
                    LEVELS.map((level, index) =>
                        <option key={index} value={index}>{`Level ${index + 1}`}</option>
                    )
                }
            </select>
        </div>
    )
}

export default LevelDropdown;