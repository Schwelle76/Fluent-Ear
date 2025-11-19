import { CHROMATIC_SCALE, SCALES } from "./SCALES"
import { Direction } from "../models/Direction";
import { defaultSettings, EarTrainingSettings } from "../models/EarTrainingSettings";
import { Scale } from "../models/Scale";


export const LEVELS : EarTrainingSettings[] = [
    {
        ...defaultSettings,
        scale: SCALES[0],
        direction: 'ascending',
    },
    {
        ...defaultSettings,
        scale: SCALES[0],
        direction: 'descending',
    },
    {
        ...defaultSettings,
        scale: SCALES[0],
        direction: 'any',
    },
    {
        ...defaultSettings,
        scale: SCALES[2],
        direction: 'ascending',
    },
    {
        ...defaultSettings,
        scale: SCALES[2],
        direction: 'descending',
    },
    {
        ...defaultSettings,
        scale: SCALES[2],
        direction: 'any',
    },
    {
        ...defaultSettings,
        scale: SCALES[4],
        direction: 'ascending',
    },
    {
        ...defaultSettings,
        scale: SCALES[4],
        direction: 'descending',
    },
    {
        ...defaultSettings,
        scale: SCALES[4],
        direction: 'any',
    },
    {
        ...defaultSettings,
        scale: SCALES[1],
        direction: 'ascending',
    },
    {
        ...defaultSettings,
        scale: SCALES[1],
        direction: 'descending',
    },
    {
        ...defaultSettings,
        scale: SCALES[1],
        direction: 'any',
    },
    {
        ...defaultSettings,
        scale: SCALES[3],
        direction: 'ascending',
    },
    {
        ...defaultSettings,
        scale: SCALES[3],
        direction: 'descending',
    },
    {
        ...defaultSettings,
        scale: SCALES[3],
        direction: 'any',
    },
    {
        ...defaultSettings,
        scale: SCALES[5],
        direction: 'ascending',
    },
    {
        ...defaultSettings,
        scale: SCALES[5],
        direction: 'descending',
    },
    {
        ...defaultSettings,
        scale: SCALES[5],
        direction: 'any',
    },
    {
        ...defaultSettings,
        scale: new Scale("", ['1', 'm2', 'M2', '4', 'b5', '5', 'M7']),
        direction: 'ascending',
    },
    {
        ...defaultSettings,
        scale: new Scale("",['1', 'm2', 'M2', '4', 'b5', '5', 'M7']),
        direction: 'descending',
    },
    {
        ...defaultSettings,
        scale: new Scale("",['1', 'm2', 'M2', '4', 'b5', '5', 'M7']),
        direction: 'any',
    },
    {
        ...defaultSettings,
        scale: new Scale("",['m3', 'M3']),
        direction: 'ascending'
    },
    {
        ...defaultSettings,
        scale: new Scale("",['M3', 'm3']),
        direction: 'descending'
    },
    {
        ...defaultSettings,
        scale: new Scale("",['m3', 'M3']),
        direction: 'any'
    },
    {
        ...defaultSettings,
        scale: new Scale("",['m7', 'M7']),
        direction: 'ascending'
    },
    {
        ...defaultSettings,
        scale: new Scale("",['M7', 'm7']),
        direction: 'descending'
    },
    {
        ...defaultSettings,
        scale: new Scale("",['m7', 'M7']),
        direction: 'any'
    },
    {
        ...defaultSettings,
        scale: new Scale("",['m6', 'M6']),
        direction: 'ascending',
    },
    {
        ...defaultSettings,
        scale: new Scale("",['M6', 'm6']),
        direction: 'descending',
    },
    {
        ...defaultSettings,
        scale: new Scale("",['m6', 'M6']),
        direction: 'any',
    },
    {
        ...defaultSettings,
        scale: new Scale("",['m2', 'M2', 'm3', 'M3']),
        direction: 'ascending',
    },
    {
        ...defaultSettings,
        scale: new Scale("",['m2', 'M2', 'm3', 'M3']),
        direction: 'descending',
    },
    {
        ...defaultSettings,
        scale: new Scale("",['m2', 'M2', 'm3', 'M3']),
        direction: 'any',
    },
    {
        ...defaultSettings,
        scale: new Scale("",['m2', 'M2', 'm3', 'M3', 'm6', 'M6', 'm7', 'M7']),
        direction: 'ascending',
    },
    {
        ...defaultSettings,
        scale: new Scale("",['m2', 'M2', 'm3', 'M3', 'm6', 'M6', 'm7', 'M7']),
        direction: 'descending',
    },
    {
        ...defaultSettings,
        scale: new Scale("",['m2', 'M2', 'm3', 'M3', 'm6', 'M6', 'm7', 'M7']),
        direction: 'any',
    },
    {
        ...defaultSettings,
        scale: SCALES[6],
        direction: 'ascending',
    },
    {
        ...defaultSettings,
        scale: SCALES[6],
        direction: 'descending',
    },
    {
        ...defaultSettings,
        scale: SCALES[6],
        direction: 'any',
    }

]
