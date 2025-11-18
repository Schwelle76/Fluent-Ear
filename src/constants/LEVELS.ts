import { CHROMATIC_SCALE, SCALES } from "./SCALES"
import { Direction } from "../models/Direction";


export type Level = {
    intervals: string[],
    direction: Direction;
}

export const LEVELS : Level[] = [
    {
        intervals: SCALES[0].intervals,
        direction: 'ascending',
    },
    {
        intervals: SCALES[0].intervals,
        direction: 'descending',
    },
    {
        intervals: SCALES[0].intervals,
        direction: 'any',
    },
    {
        intervals: SCALES[2].intervals,
        direction: 'ascending',
    },
    {
        intervals: SCALES[2].intervals,
        direction: 'descending',
    },
    {
        intervals: SCALES[2].intervals,
        direction: 'any',
    },
    {
        intervals: SCALES[4].intervals,
        direction: 'ascending',
    },
    {
        intervals: SCALES[4].intervals,
        direction: 'descending',
    },
    {
        intervals: SCALES[4].intervals,
        direction: 'any',
    },
    {
        intervals: SCALES[1].intervals,
        direction: 'ascending',
    },
    {
        intervals: SCALES[1].intervals,
        direction: 'descending',
    },
    {
        intervals: SCALES[1].intervals,
        direction: 'any',
    },
    {
        intervals: SCALES[3].intervals,
        direction: 'ascending',
    },
    {
        intervals: SCALES[3].intervals,
        direction: 'descending',
    },
    {
        intervals: SCALES[3].intervals,
        direction: 'any',
    },
    {
        intervals: SCALES[5].intervals,
        direction: 'ascending',
    },
    {
        intervals: SCALES[5].intervals,
        direction: 'descending',
    },
    {
        intervals: SCALES[5].intervals,
        direction: 'any',
    },
    {
        intervals: ['1', 'm2', 'M2', '4', 'b5', '5', 'M7'],
        direction: 'ascending',
    },
    {
        intervals: ['1', 'm2', 'M2', '4', 'b5', '5', 'M7'],
        direction: 'descending',
    },
    {
        intervals: ['1', 'm2', 'M2', '4', 'b5', '5', 'M7'],
        direction: 'any',
    },
    {
        intervals: ['m3', 'M3'],
        direction: 'ascending'
    },
    {
        intervals: ['M3', 'm3'],
        direction: 'descending'
    },
    {
        intervals: ['m3', 'M3'],
        direction: 'any'
    },
    {
        intervals: ['m7', 'M7'],
        direction: 'ascending'
    },
    {
        intervals: ['M7', 'm7'],
        direction: 'descending'
    },
    {
        intervals: ['m7', 'M7'],
        direction: 'any'
    },
    {
        intervals: ['m6', 'M6'],
        direction: 'ascending',
    },
    {
        intervals: ['M6', 'm6'],
        direction: 'descending',
    },
    {
        intervals: ['m6', 'M6'],
        direction: 'any',
    },
    {
        intervals: ['m2', 'M2', 'm3', 'M3'],
        direction: 'ascending',
    },
    {
        intervals: ['m2', 'M2', 'm3', 'M3'],
        direction: 'descending',
    },
    {
        intervals: ['m2', 'M2', 'm3', 'M3'],
        direction: 'any',
    },
    {
        intervals: ['m2', 'M2', 'm3', 'M3', 'm6', 'M6', 'm7', 'M7'],
        direction: 'ascending',
    },
    {
        intervals: ['m2', 'M2', 'm3', 'M3', 'm6', 'M6', 'm7', 'M7'],
        direction: 'descending',
    },
    {
        intervals: ['m2', 'M2', 'm3', 'M3', 'm6', 'M6', 'm7', 'M7'],
        direction: 'any',
    },
    {
        intervals: SCALES[6].intervals,
        direction: 'ascending',
    },
    {
        intervals: SCALES[6].intervals,
        direction: 'descending',
    },
    {
        intervals: SCALES[6].intervals,
        direction: 'any',
    }

]
