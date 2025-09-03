import { PitchClass, PITCH_CLASSES } from "../models/Note";

export default class NoteFromKeyboardDetector {

  currentKey: PitchClass | undefined;
  onNote: (note: PitchClass | undefined) => void;

  constructor(onNote: (note: PitchClass | undefined) => void) {
    this.onNote = onNote;
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  private handleKeyDown =(keyboardEvent: KeyboardEvent) => {
    if (keyboardEvent.repeat) return;

    if (this.currentKey !== keyboardEvent.key) {

      this.currentKey = keyboardEvent.key;

      let currentString = this.currentKey?.trim().toUpperCase().toString();

      if (keyboardEvent.shiftKey) {
        console.log("shift key is pressed");
        currentString += '#';
      }

      if (currentString != undefined && PITCH_CLASSES.includes(currentString)) {
        this.onNote(currentString);
      }
    }
  }

  private handleKeyUp = (keyboardEvent: KeyboardEvent) => {
    if (this.currentKey === keyboardEvent.key) {
      this.currentKey = undefined;
      this.onNote(this.currentKey);
    }
  }



  public destroy() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
  }

}
