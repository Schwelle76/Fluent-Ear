import React from 'react';
import { LEVELS } from '../constants/LEVELS';
import Select from 'react-select';
import lockIcon from '../assets/lock.svg';
import {LevelDropdownStyles} from './LevelDropDownStyles';


interface LevelDropdownProps {
    selectedLevel: number;
    onChange: (level: number) => void;
    onToggle: (isOpen: boolean) => void;
    unlockedLevels: number;
}

export interface Option {
    value: number;
    label: string;
    isDisabled: boolean;
}


const LevelDropdown : React.FC<LevelDropdownProps> = ({ selectedLevel, unlockedLevels, onChange, onToggle }) => {

    const options = LEVELS.map((_, index) => ({
        value: index,
        label: `Level ${index + 1}`,
        isDisabled: index > unlockedLevels
    }));

    const currentValue = selectedLevel === -1 
        ? { value: -1, label: 'Custom Level', isDisabled: false} 
        : options.find(opt => opt.value === selectedLevel) || options[0];

    const formatOptionLabel = ({ label, isDisabled }: Option) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isDisabled && (
                <img 
                    src={lockIcon} 
                    alt="locked" 
                    style={{ width: '12px', height: '12px' }} 
                />
            )}
            <span>{label}</span>
        </div>
    );

    return (
        <div>
            <Select
                value={currentValue}
                onChange={(selectedOption) => onChange(selectedOption?.value || 0)}
                options={options}
                formatOptionLabel={formatOptionLabel}
                isSearchable={false}
                styles={LevelDropdownStyles}
                onMenuOpen={() => onToggle(true)}
                onMenuClose={() => onToggle(false)}
            />
        </div>
    );
};

export default LevelDropdown;