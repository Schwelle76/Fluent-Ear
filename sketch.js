let cnv;
let monoSynth;
let paused = true;
let notes = ['C', 'C#', 'D','D#', 'E', 'F','F#', 'G','G#', 'A', 'A#', 'B'];
let intervals = ['1', 'm2','M2', 'm3', 'M3', '4', 'b5', '5', 'm6', 'M6', 'm7', 'M7'];
let currentNote;
let noiseBarrier = .01;
let volumeMeterDisplayAmp = 30000;


let pauseButton;
let modeButton;
let startMicButton;
let slider;
let displayInterval = false;
let textPosX; 
let textPosY; 
let bottomMargin = 10;
let sideMargin = 10;
let topMargin = 10;

function setup() {
  cnv = createCanvas(windowWidth, windowHeight);

  monoSynth = new p5.MonoSynth();

  setupElements();
  
}


function draw() {
  background(255);
  alignElements();

  displayVolumeMeterAndNoiseBarrierSlider();

  if (paused)
  {
    fill(0, 0, 0);
    text("Pause", textPosX, textPosY);
  }
  else
  {
    displayNote();    
    play();
    console.log(detectedNote);
  }

}

function play(){
  if (enabledPitchDetection){
    if (volume > noiseBarrier && detectedNote == currentNote)
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

function displayVolumeMeterAndNoiseBarrierSlider(){

  let volumeMeterWidth = 20;
  let noiseBarrierSliderSize = 20;
  let volumeMeterX = width - volumeMeterWidth * 1.5;


  fill(255, 0, 0);
  rect(volumeMeterX, height - bottomMargin, volumeMeterWidth, -volume * volumeMeterDisplayAmp);
  fill(0);
  circle(volumeMeterX + noiseBarrierSliderSize/2, height - bottomMargin - noiseBarrier * volumeMeterDisplayAmp, noiseBarrierSliderSize);
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

  pauseButton.position(width / 2 - pauseButton.width / 2, height  - bottomMargin - pauseButton.height);

  modeButton.position(width - modeButton.width - sideMargin, topMargin);

  startMicButton.position(width / 2 - startMicButton.width / 2, topMargin);

  slider.style('width', '200px');
  slider.position(width/2, 40);
  slider.center('horizontal');
}