import { SCALES } from "../constants/SCALES";
import { Direction } from "./Direction";
import { Interval } from "./Note";
import { Scale } from "./Scale";

export type EarTrainingSettings = {
    melodyLength: number;
    scale: Scale;
    root: string;
    direction: Direction;
}

export const defaultSettings : EarTrainingSettings = {
    melodyLength: 1,
    scale: SCALES[0],
    root: 'random',
    direction: 'ascending'
}