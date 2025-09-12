import { Scale } from '../models/Scale';


export const CHROMATIC_SCALE = new Scale('Chromatic Scale', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);

export const SCALES = [
   new Scale('Major Chord', [0, 4, 7]),
   new Scale('Minor Chord', [0, 3, 7]),
   new Scale('Pentatonic Major', [0, 2, 4, 7, 9]),
   new Scale('Pentatonic Minor', [0, 2, 3, 5, 7, 10]),
   new Scale('Major Scale', [0, 2, 4, 5, 7, 9, 11]),
   new Scale('Minor Scale', [0, 2, 3, 5, 7, 8, 10]),
   CHROMATIC_SCALE
  ]

