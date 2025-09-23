export const PITCH_CLASSES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;
export type PitchClass = typeof PITCH_CLASSES[number];

export function isPitchClass(item: any): item is PitchClass {

  if (typeof item !== 'string') return false;
  return (PITCH_CLASSES as readonly string[]).includes(item);
}

export function parsePitchClass(str: string): PitchClass | undefined {
  if (isPitchClass(str)) return str;
  else return undefined;
}

export const INTERVALS = ['1', 'm2', 'M2', 'm3', 'M3', '4', 'b5', '5', 'm6', 'M6', 'm7', 'M7'] as const;
export type Interval = typeof INTERVALS[number];

export function getInterval(note: PitchClass, tonic: PitchClass) {
  const noteIndex = PITCH_CLASSES.indexOf(note);
  const tonicIndex = PITCH_CLASSES.indexOf(tonic);

  const semitoneDistance = (noteIndex - tonicIndex + 12) % 12;
  return INTERVALS[semitoneDistance];
}

export function getPitchClass(tonic: PitchClass, interval: Interval) {
  const tonicIndex = PITCH_CLASSES.indexOf(tonic);
  const semitoneDistance = INTERVALS.indexOf(interval);

  const targetNoteIndex = (tonicIndex + semitoneDistance) % 12;

  return PITCH_CLASSES[targetNoteIndex];
}

export function randomPitchClass(): PitchClass {
  return PITCH_CLASSES[Math.floor(Math.random() * PITCH_CLASSES.length)];
}


export class Note {

  pitchClass: PitchClass;
  octave: number;

  constructor(pitchClass: PitchClass, octave: number = 4) {
    this.pitchClass = pitchClass;
    this.octave = octave;
  }

  public toString() {
    return this.pitchClass + this.octave;
  }

  public equals(other: Note): boolean {
    return this.pitchClass === other.pitchClass &&
      this.octave === other.octave;
  }

  public getInterval(tonic: Note) {
    return getInterval(this.pitchClass, tonic.pitchClass);
  }

}
