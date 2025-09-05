import React, {createContext, use, useContext} from 'react';
import useEarTrainingSettings from '../hooks/useEarTrainingSettings';

type EarTrainingSettingsType = ReturnType<typeof useEarTrainingSettings>;
export const EarTrainingSettingsContext = createContext<EarTrainingSettingsType | undefined>(undefined);


export function useEarTrainingSettingsContext() {
    const context = useContext(EarTrainingSettingsContext);
    if(!context) {
        throw new Error('useEarTrainingGameSettingsContext must be used within a EarTrainingGameSettingsContext');
    }
    return context;
}

