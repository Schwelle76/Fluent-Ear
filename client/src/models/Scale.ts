import { PITCH_CLASSES, INTERVALS } from "./Note";

export class Scale {

  name: string;
  intervals: string[];
  halftoneSteps: number[];

  constructor(name: string, steps: number[]);
  constructor(name: string, intervals: string[]);

  constructor(name: string, input: string[] | number[]) {
    this.name = name;

    if (typeof input[0] === 'string') {
      this.intervals = input as string[];
      this.halftoneSteps = input.map(interval => {
        const step = INTERVALS.findIndex(i => i === interval);
        if (step === -1) {
          throw new Error(`Invalid interval: ${interval}`);
        }
        return step;
      });
    } else {
      this.halftoneSteps = input as number[];
      this.intervals = this.halftoneSteps.map(step => INTERVALS[step]);

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
}

