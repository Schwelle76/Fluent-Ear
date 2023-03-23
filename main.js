let notes = ['C', 'C#', 'D','D#', 'E', 'F','F#', 'G','G#', 'A', 'A#', 'B'];
let intervals = ['1', 'm2','M2', 'm3', 'M3', '4', 'b5', '5', 'm6', 'M6', 'm7', 'M7'];
let allowedNotes = ['C', 'C#', 'D','D#', 'E', 'F','F#', 'G','G#', 'A', 'A#', 'B'];
let allowedIntervals = ['1'];
let currentTargetNote;
let displayInterval = false;

setInterval("play()", 10);


function play(){

    if (currentTargetNote == null)
      nextNote();

  /*
    if (enabledPitchDetection){
      if (volume > noiseBarrier && detectedNote == currentNote && synthVolume() == 0)
        nextNote();
    }
    */
    if (detectedNote == currentTargetNote)
        nextNote();
    
	const htmlDetectedNoteElement = document.getElementById("targetNote");

    if (displayInterval)
    htmlDetectedNoteElement.textContent = intervals[notes.indexOf(currentTargetNote)];
  else
    htmlDetectedNoteElement.textContent = currentTargetNote;
  
}

function nextNote(){
    currentTargetNote = allowedNotes[Math.floor(Math.random()*allowedNotes.length)];;
}

function enableOrDisableInterval(interval){

  const indexOfInterval = allowedIntervals.indexOf(interval);
  if (indexOfInterval > -1) { 
  allowedIntervals.splice(indexOfInterval, 1);
  }
  else allowedIntervals.push(interval);

  /*
  if (!allowedIntervals.includes(currentTargetNote))
    nextNote();
*/
}


function enableOrDisableNote(interval){

  const IndexOfNote = allowedNotes.indexOf(interval);
  if (IndexOfNote > -1) { 
    allowedNotes.splice(IndexOfNote, 1);
  }
  else allowedNotes.push(interval);

  if (!allowedNotes.includes(currentTargetNote))
    nextNote();
}

function scrollDown() {
  window.scrollBy(0, 99999999);  
};

function scrollUp() {
  window.scrollBy(0, -99999999);  
};

