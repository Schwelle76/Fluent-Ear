let cnv;
let mic;
let monoSynth;
let pause = true;
let notes = ['C4', 'C#4', 'D4','D#4', 'E4', 'F4','F#4', 'G4','G#4', 'A4', 'A#4', 'B4'];
let intervals = ['1', 'm2','M2', 'm3', 'M3', '4', 'b5', '5', 'm6', 'M6', 'm7', 'M7'];
let currentNote;
let button;
let slider;
let displayInterval = false;
let textPosX; 
let textPosY; 

function setup() {
  cnv = createCanvas(windowWidth, windowHeight);

  mic = new p5.AudioIn();
  mic.start();

  textAlign(CENTER);

  switchToNoteMode();

  slider = createSlider(-200, -50, 100 , 1);

  monoSynth = new p5.MonoSynth();

  alignElements();
}

function draw() {
  background(220);

  alignElements();

  micInput();

  if (pause)
    text("Pause", textPosX, textPosY);
  else{
    if (displayInterval)
      text(intervals[notes.indexOf(currentNote)], textPosX, textPosY);
    else
      text(currentNote, textPosX, textPosY);
    
    if (frameCount % -slider.value() == 0) {
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
  if (button)
    button.remove();
  button = createButton("Notes");
  button.mousePressed(switchToNoteMode);

  displayInterval = true;
}

function switchToNoteMode(){
  if (button)
    button.remove();
  button = createButton("Intervals");
  button.mousePressed(switchToIntervalMode);

  displayInterval = false;
}

function alignElements(){

  cnv.resize(windowWidth, windowHeight);
  textSize(width /10);
  textPosX = width / 2;
  textPosY = height /2 + slider.position().y;

  button.position(width - button.width - 10, 10);

  slider.style('width', '200px');
  slider.position(width/2, 40);
  slider.center('horizontal');
}