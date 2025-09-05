import { PitchClass } from "./Note";
import { Scale } from "./Scale";
import { Direction } from "./Direction";


export default class EarTrainingSettings {

    root: PitchClass;
    direction: Direction;
    scale: Scale;

    constructor(root: PitchClass,
        direction: Direction,
        scale: Scale) {
        this.root = root;
        this.direction = direction;
        this.scale = scale;
    }

}