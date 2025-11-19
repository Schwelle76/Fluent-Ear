import React from 'react';
import styles from './LevelDropdown.module.css';
import {LEVELS} from '../constants/LEVELS';


interface LevelDropdownProps {
    selectedLevel: number;
    onChange: (level: number) => void;
}

const LevelDropdown : React.FC<LevelDropdownProps> = ({selectedLevel, onChange}) => {


    return (
        <div>
            <select value={selectedLevel.toString()} onChange={(e) => onChange(parseInt(e.target.value))}>

                <option key = '-1' value={-1} hidden>Custom Level</option>
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