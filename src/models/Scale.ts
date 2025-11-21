import { Direction } from "./Direction";
import { PITCH_CLASSES, BASE_INTERVALS, Interval, INTERVALS } from "./Note";

export class Scale {

  name: string;
  intervals: Interval[];
  halftoneSteps: number[];

  constructor(name: string, steps: number[]);
  constructor(name: string, intervals: string[]);
  constructor(name: string , intervals: Interval[]);

  constructor(name: string = "Unnamed Scale", input: string[] | number[] | Interval[]) {
    this.name = name;

    if (typeof input[0] === 'string') {
      this.intervals = input as Interval[];
      this.halftoneSteps = input.map(interval => {
        const step = BASE_INTERVALS.findIndex(i => i === interval);
        if (step === -1) {
          throw new Error(`Invalid interval: ${interval}`);
        }
        return step;
      });
    } else {
      this.halftoneSteps = input as number[];
      this.intervals = this.halftoneSteps.map(step => BASE_INTERVALS[step]);

    }
  }

  getPitchClasses(tonic: string) {
    const tonicIndex = PITCH_CLASSES.findIndex(note => note === tonic);
    if (tonicIndex === -1) throw new Error('Invalid tonic note');

    const pitchClasses =  this.halftoneSteps.map(halftoneStep => {
      const noteIndex = (tonicIndex + halftoneStep) % 12;
      return PITCH_CLASSES[noteIndex];
    });

    return pitchClasses;
  }

  getIntervals() {
    return this.intervals;
  }

  getDirectionSensitiveIntervals (direction: Direction) {

    let intervals: Interval[] = [];

    if(!this.intervals.includes('1') || direction === 'descending')
      intervals = this.intervals;

    if(direction === 'ascending')
      intervals = [...this.intervals.filter(interval => interval !== '1'), '8'];
    if(direction === 'any')
      intervals = [...this.intervals, '8'];

    return intervals.sort(
            (a, b) => INTERVALS.indexOf(a) - INTERVALS.indexOf(b)
        );;

  }

}

