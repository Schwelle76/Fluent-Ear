import { StylesConfig } from "react-select";
import {Option} from "./LevelDropdown";

export const LevelDropdownStyles: StylesConfig<Option, false> = {
        // 1. Das Haupt-Eingabefeld (geschlossener Zustand)
        control: (provided, state) => ({
            ...provided,
            backgroundColor: 'black',
            borderColor: state.isFocused ? '#000000' :  '#000000', // Randfarbe
            color: 'white',
            boxShadow: '#000000', // Focus-Glow
            fontSize: '1.5rem',

            ':hover': {
            ...provided[':hover'], // Behalte andere Hover-Styles
            borderColor: 'white',  // Setze Randfarbe beim Hover explizit auf Schwarz
        },
        }),
        
        // 2. Das ausklappbare Menü (Container)
        menu: (provided) => ({
            ...provided,
            backgroundColor: 'black',
        }),

        // 3. Die einzelnen Optionen in der Liste
        option: (provided, state) => ({
            ...provided,
            // Hintergrundlogik: Ausgewählt -> Dunkelgrau, Hover -> Hellschwarz, Sonst -> Schwarz
            backgroundColor: state.isSelected 
                ? '#333' 
                : state.isFocused 
                    ? '#1a1a1a' 
                    : 'black',
            color: state.isDisabled ? '#636363ff' : 'white', // Textfarbe immer weiß
            cursor: state.isDisabled ? 'not-allowed' : 'pointer',
            ':active': {
                backgroundColor: '#444', // Klick-Farbe
            },
        }),

        // 4. Der Text des aktuell ausgewählten Wertes (im geschlossenen Zustand)
        singleValue: (provided) => ({
            ...provided,
            color: 'white',
        }),

        // 5. (Optional) Der Pfeil nach unten und Trennstrich
        dropdownIndicator: (provided) => ({
            ...provided,
            color: 'white',
            ':hover': { color: '#ccc' }
        }),
        indicatorSeparator: (provided) => ({
            ...provided,
            backgroundColor: 'none',
        }),
    };