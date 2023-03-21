let notes = ['C', 'C#', 'D','D#', 'E', 'F','F#', 'G','G#', 'A', 'A#', 'B'];
let intervals = ['1', 'm2','M2', 'm3', 'M3', '4', 'b5', '5', 'm6', 'M6', 'm7', 'M7'];
let currentNote;
let displayInterval = false;

setInterval("play()", 10);


function play(){

    console.log(currentNote);

    if (currentNote == null)
      nextNote();

  /*
    if (enabledPitchDetection){
      if (volume > noiseBarrier && detectedNote == currentNote && synthVolume() == 0)
        nextNote();
    }
    */
    if (detectedNote == currentNote)
        nextNote();
    
	const htmlDetectedNoteElement = document.getElementById("targetNote");

    if (displayInterval)
    htmlDetectedNoteElement.textContent = intervals[notes.indexOf(currentNote)];
  else
    htmlDetectedNoteElement.textContent = currentNote;



  
}

function nextNote(){
    currentNote = notes[Math.floor(Math.random()*notes.length)];;
}
