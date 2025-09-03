export const PITCH_CLASSES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as string[];
export type PitchClass = typeof PITCH_CLASSES[number];

export const INTERVALS = ['1', 'm2', 'M2', 'm3', 'M3', '4', 'b5', '5', 'm6', 'M6', 'm7', 'M7'];

export function getInterval(note: PitchClass, tonic: PitchClass) {
  const noteIndex = PITCH_CLASSES.indexOf(note);
  const tonicIndex = PITCH_CLASSES.indexOf(tonic);
  if (noteIndex === -1 || tonicIndex === -1) return undefined;

  const semitoneDistance = (noteIndex - tonicIndex + 12) % 12;
  return INTERVALS[semitoneDistance];
}

export class Note {

  pitchClass: PitchClass;
  octave: number;

  constructor(pitchClass: PitchClass, octave: number = 4) { 
    this.pitchClass = pitchClass;
    this.octave = octave;
  }

  public toString(){
    return this.pitchClass + this.octave;
  }

  public getInterval(tonic: Note) {
    return getInterval(this.pitchClass, tonic.pitchClass);
  }
  
}
