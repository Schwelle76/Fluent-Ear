let notes = ['C', 'C#', 'D','D#', 'E', 'F','F#', 'G','G#', 'A', 'A#', 'B'];
let intervals = ['1', 'm2','M2', 'm3', 'M3', '4', 'b5', '5', 'm6', 'M6', 'm7', 'M7'];
let currentTargetNote;
let displayInterval = false;

setInterval("play()", 10);


function play(){

    console.log(currentTargetNote);

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
    currentTargetNote = notes[Math.floor(Math.random()*notes.length)];;
}
