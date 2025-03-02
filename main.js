let notes = ['C', 'C#', 'D','D#', 'E', 'F','F#', 'G','G#', 'A', 'A#', 'B'];
let intervals = ['1', 'm2','M2', 'm3', 'M3', '4', 'b5', '5', 'm6', 'M6', 'm7', 'M7'];
let allowedNotes = ['C', 'C#', 'D','D#', 'E', 'F','F#', 'G','G#', 'A', 'A#', 'B'];
let allowedIntervals = ['1'];
let currentTargetNote;
let currentTargetInterval;
let displayInterval = false;
let htmlTargetNoteElement;
let htmlTargetIntervalElement;
let htmlNoteDisplayElement;
let htmlDetectedNoteElement = document.getElementById("detectedNote");

function startGame(){
  setInterval("play()", 10);
  htmlTargetNoteElement = document.getElementById("targetNote");
  htmlTargetIntervalElement = document.getElementById("targetInterval");
  htmlNoteDisplayElement = document.getElementById("noteDisplay");
  htmlDetectedNoteElement = document.getElementById("detectedNote");
  nextNote(); // Initialize the first target note
}

function play(){
    if (currentTargetNote == null)
      nextNote();

    if (!synthIsPlaying){
      htmlDetectedNoteElement.textContent = detectedNote;  
      if(detectedNote == getNoteWithoutOctave(currentTargetNotePlusInterval())){
        playRewardAndTriggerNextNote();
      }
    } else htmlDetectedNoteElement.textContent = "";

    if (document.getElementById("showRoot").checked) {
        htmlTargetNoteElement.style.display = "none";
    } else {
        htmlTargetNoteElement.style.display = "block";
    }

    if (document.getElementById("showInterval").checked) {
        htmlTargetIntervalElement.style.display = "none";
    } else {
        htmlTargetIntervalElement.style.display = "block";
    }

    htmlTargetIntervalElement.textContent = currentTargetInterval;
    htmlTargetNoteElement.textContent = currentTargetNote;
}

function getNoteWithoutOctave(note) {
    return note.slice(0, -1);
}

function currentTargetNotePlusInterval(){
  const noteIndex = notes.indexOf(currentTargetNote.slice(0, -1));
  const octave = parseInt(currentTargetNote.slice(-1), 10);
  const intervalIndex = intervals.indexOf(currentTargetInterval);

  // Calculate the new index and octave for both ascending and descending intervals
  let ascendingIndex = (noteIndex + intervalIndex) % notes.length;
  let ascendingOctave = octave + Math.floor((noteIndex + intervalIndex) / notes.length);

  let descendingIntervalIndex = intervals.length - intervalIndex;
  let descendingIndex = (noteIndex - descendingIntervalIndex + notes.length) % notes.length;
  let descendingOctave = octave - Math.ceil((descendingIntervalIndex - noteIndex) / notes.length);

  // Randomly choose between ascending and descending intervals
  if (Math.random() < 0.5) {
    return notes[ascendingIndex] + ascendingOctave;
  } else {
    return notes[descendingIndex] + descendingOctave;
  }
}

function playRewardAndTriggerNextNote(){
  pop(htmlNoteDisplayElement);
  nextNote();
}

function nextNote(){
    let lastTargetNote = currentTargetNote;
    let lastTargetInterval = currentTargetInterval;
    
    if (allowedNotes.length > 1 || allowedIntervals.length > 1)
      while(lastTargetNote == currentTargetNote
        && lastTargetInterval == currentTargetInterval){
          let newNote = allowedNotes[Math.floor(Math.random() * allowedNotes.length)];
          let newOctave = 4;

          currentTargetNote = newNote + newOctave;
          currentTargetInterval = allowedIntervals[Math.floor(Math.random() * allowedIntervals.length)]; 
        }

    playIntervalDelay = 0;

    if (!document.getElementById("playRoot").checked) {
        playNote(currentTargetNote);
        playIntervalDelay = 500;
    }

    if (!document.getElementById("playInterval").checked) {
        setTimeout(() => {
            playNote(currentTargetNotePlusInterval());
        }, playIntervalDelay); // Delay to play interval after target note
    }

    htmlTargetNoteElement.classList.remove("rewardingTarget");   
    htmlTargetIntervalElement.classList.remove("rewardingTarget");   
}

function enableOrDisableInterval(interval){
  const indexOfInterval = allowedIntervals.indexOf(interval);
  if (indexOfInterval > -1) { 
    allowedIntervals.splice(indexOfInterval, 1);
  } else {
    allowedIntervals.push(interval);
  }

  if (!allowedIntervals.includes(currentTargetInterval))
    nextNote();

  if(allowedIntervals.length == 1 && allowedIntervals[0] == "1")
    document.getElementById("targetInterval").style.display = 'none';
  else
    document.getElementById("targetInterval").style.display = 'inline';
}

function enableOrDisableNote(interval){
  const IndexOfNote = allowedNotes.indexOf(interval);
  if (IndexOfNote > -1) { 
    allowedNotes.splice(IndexOfNote, 1);
  } else {
    allowedNotes.push(interval);
  }

  if (!allowedNotes.includes(currentTargetNote))
    nextNote();
}

function scrollDown() {
  window.scrollBy(0, 99999999);
}

function scrollUp() {
  window.scrollBy(0, -99999999);  
}

function getStyleProp(elem, prop){
    if(window.getComputedStyle)
        return window.getComputedStyle(elem, null).getPropertyValue(prop);
    else if(elem.currentStyle) return elem.currentStyle[prop]; //IE
}

function getAnimationDuration(elem){
  return parseFloat(getStyleProp(elem, "animation-duration").replace('s', ''));
}

