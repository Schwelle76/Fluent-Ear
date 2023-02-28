let cnv;
let monoSynth;
let pause = true;
let notes = ['C', 'C#', 'D','D#', 'E', 'F','F#', 'G','G#', 'A', 'A#', 'B'];
let intervals = ['1', 'm2','M2', 'm3', 'M3', '4', 'b5', '5', 'm6', 'M6', 'm7', 'M7'];
let currentNote;
let modeButton;
let startMicButton;
let slider;
let displayInterval = false;
let textPosX; 
let textPosY; 

function setup() {
  cnv = createCanvas(windowWidth, windowHeight);

  textAlign(CENTER);

  switchToNoteMode();

  slider = createSlider(-200, -50, 100 , 1);

  monoSynth = new p5.MonoSynth();

  startMicButton = createButton("Start Microphone");
  startMicButton.mousePressed(startPitchDetect);
  
}

function draw() {
  background(220);

  alignElements();

 // micInput();

  if (pause)
    text("Pause", textPosX, textPosY);
  else{
    if (displayInterval)
      text(intervals[notes.indexOf(currentNote)], textPosX, textPosY);
    else
      text(currentNote, textPosX, textPosY);
    
    print(detectedNote);

    if (enabledPitchDetection){
      if (detectedNote == currentNote){
        currentNote = random(notes);
        playSynth();
      }
    }
    else if (frameCount % -slider.value() == 0) {
      currentNote = random(notes);
      playSynth();
    }

}

}

function keyPressed(){
  if(key == " ")
    pause = !pause;
}

function playSynth() {
  userStartAudio();

  // note velocity (volume, from 0 to 1)
  let velocity = 1;
  // time from now (in seconds)
  let time = 0;
  // note duration (in seconds)
  let dur = 1/6;

  monoSynth.play(currentNote, velocity, time, dur);

}


function switchToIntervalMode(){
  if (modeButton)
    modeButton.remove();
  modeButton = createButton("Notes");
  modeButton.mousePressed(switchToNoteMode);

  displayInterval = true;
}

function switchToNoteMode(){
  if (modeButton)
    modeButton.remove();
  modeButton = createButton("Intervals");
  modeButton.mousePressed(switchToIntervalMode);

  displayInterval = false;
}

function alignElements(){

  cnv.resize(windowWidth, windowHeight);
  textSize(width /10);
  textPosX = width / 2;
  textPosY = height /2 + slider.position().y;

  modeButton.position(width - modeButton.width - 10, 10);

  startMicButton.position(width / 2 - startMicButton.width / 2, 10);

  slider.style('width', '200px');
  slider.position(width/2, 40);
  slider.center('horizontal');
}