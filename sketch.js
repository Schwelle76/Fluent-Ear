let cnv;
let monoSynth;
let paused = true;
let notes = ['C', 'C#', 'D','D#', 'E', 'F','F#', 'G','G#', 'A', 'A#', 'B'];
let intervals = ['1', 'm2','M2', 'm3', 'M3', '4', 'b5', '5', 'm6', 'M6', 'm7', 'M7'];
let currentNote;
let pauseButton;
let modeButton;
let startMicButton;
let slider;
let displayInterval = false;
let textPosX; 
let textPosY; 

function setup() {
  cnv = createCanvas(windowWidth, windowHeight);

  monoSynth = new p5.MonoSynth();

  setupElements();
  
}

function draw() {
  background(220);
  alignElements();

  if (paused)
    text("Pause", textPosX, textPosY);
  else
  {
    displayNote();    
    play();
    print(detectedNote);
  }

}

function play(){
  if (enabledPitchDetection){
    if (detectedNote == currentNote)
      nextNote();
  }
  else if (frameCount % -slider.value() == 0) {
    nextNote();
  }
}

function pause(){
  paused = !paused;
}

function nextNote(){
  currentNote = random(notes);
  playSynth();
}

function displayNote(){
    if (displayInterval)
      text(intervals[notes.indexOf(currentNote)], textPosX, textPosY);
    else
      text(currentNote, textPosX, textPosY);
}

function keyPressed(){
  if(key == " ")
    pause();
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

function setupElements(){
  textAlign(CENTER);
  slider = createSlider(-200, -50, 100 , 1);

  pauseButton = createButton("Pause");
  pauseButton.mousePressed(pause);

  startMicButton = createButton("Start Microphone");
  startMicButton.mousePressed(startPitchDetect);

  switchToNoteMode();
}

function alignElements(){

  cnv.resize(windowWidth, windowHeight);
  textSize(width /10);
  textPosX = width / 2;
  textPosY = height /2 + slider.position().y;

  pauseButton.position(width / 2 - pauseButton.width / 2, height  -50);

  modeButton.position(width - modeButton.width - 10, 10);

  startMicButton.position(width / 2 - startMicButton.width / 2, 10);

  slider.style('width', '200px');
  slider.position(width/2, 40);
  slider.center('horizontal');
}