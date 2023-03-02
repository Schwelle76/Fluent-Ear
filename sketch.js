let cnv;
let monoSynth;
let synthFft;
let paused = true;
let notes = ['C', 'C#', 'D','D#', 'E', 'F','F#', 'G','G#', 'A', 'A#', 'B'];
let intervals = ['1', 'm2','M2', 'm3', 'M3', '4', 'b5', '5', 'm6', 'M6', 'm7', 'M7'];
let octave = "4";
let currentNote;
let noiseBarrier = .007;

let volumeMeterDisplayAmp = 30000;
let volumeMeterWidth = 20;
function volumeMeterX(){return width - volumeMeterWidth * 1.5};
function volumeMeterY(){return height - bottomMargin};
let noiseBarrierSliderSize = 20;
function noiseBarrierSliderX(){return volumeMeterX() + noiseBarrierSliderSize / 2};
function noiseBarrierSliderY(){return volumeMeterY() - noiseBarrier * volumeMeterDisplayAmp};
function noiseBarrierMax(){return (height - noiseBarrierSliderSize) / volumeMeterDisplayAmp;}
let dragNoiseBarrierSlider = false;

let pauseButtonX;
let pauseButtonY;
let pauseButtonWidth;
let pauseButtonHeight;
let modeButton;
let startMicButton;
let displayInterval = false;
let targetNoteX; 
let targetNoteY; 
let targetNoteSize;
let detectedNoteX; 
let detectedNoteY;
let detectedNoteSize;
let bottomMargin = 10;
let sideMargin = 10;
let topMargin = 10;

function setup() {
  cnv = createCanvas(windowWidth, windowHeight);

  monoSynth = new p5.MonoSynth();
  synthFft = new p5.FFT();
  synthFft.setInput(monoSynth);

  setupElements();
  
}


function draw() {
  alignElements();
  background(0);

  
  drawVolumeMeterAndNoiseBarrierSlider();

  if (paused)
  {
    textSize(targetNoteSize);
    fill(255, 200);
    text("Pause", targetNoteX, targetNoteY);
  }
  else
  {
    displayDetectedNote();
    displayTargetNote();    
    play();
  }

  //showPauseButton();
  fill (255, 0, 0);
  rect (width / 2, height / 2, 30);

}

function play(){

  if (currentNote == null)
    nextNote();

  if (enabledPitchDetection){
    if (volume > noiseBarrier && detectedNote == currentNote && synthVolume() == 0)
      nextNote();
  }

}

function pause(){
  paused = !paused;
}

function showPauseButton(){
      //SHOW PAUSE BUTTON
      rectMode(CENTER);
      fill(255, 0, 0);
      rect(pauseButtonX, pauseButtonY, pauseButtonWidth, pauseButtonHeight);
}

function nextNote(){
  currentNote = random(notes);
  //playSynth();
}

function displayTargetNote(){

  textSize(targetNoteSize);
  
    if (displayInterval)
      text(intervals[notes.indexOf(currentNote)], targetNoteX, targetNoteY);
    else
      text(currentNote, targetNoteX, targetNoteY);

}

function displayDetectedNote(){

  textSize(detectedNoteSize);

  if (detectedNote != "unidentified"){
    text(detectedNote, detectedNoteX, detectedNoteY);
  }
}

function keyPressed(){
  if(key == " ")
    pause();
}

function playSynth() {
  //NOT IN USE!!!
  userStartAudio();

  // note velocity (volume, from 0 to 1)
  let velocity = 1;
  // time from now (in seconds)
  let time = 0;
  // note duration (in seconds)
  let dur = 1/6;

  monoSynth.play(currentNote + octave, velocity, time, dur);

}

function synthVolume(){
  let spectrum = synthFft.analyze();
  let sumSquares = 0.0;
  for (const amplitude of spectrum) { sumSquares += amplitude*amplitude; }
  return Math.sqrt(sumSquares / spectrum.length);
}

function drawVolumeMeterAndNoiseBarrierSlider(){
  
  rectMode(CORNER);
  fill(10, 180, 255, 200);
  rect(volumeMeterX(), volumeMeterY(), volumeMeterWidth, -volume * volumeMeterDisplayAmp);
  fill(200);
  circle(noiseBarrierSliderX(), noiseBarrierSliderY(), noiseBarrierSliderSize);

  if (dragNoiseBarrierSlider)
    if (touches.length > 0)
      noiseBarrier = (volumeMeterY() - touches[0].y) / volumeMeterDisplayAmp;
    else
      noiseBarrier = (volumeMeterY() - mouseY) / volumeMeterDisplayAmp;

    noiseBarrier = Math.max(noiseBarrier, 0);
    noiseBarrier = Math.min(noiseBarrier, noiseBarrierMax());

}

function mouseClicked(){

  if (pauseButtonX + pauseButtonWidth / 2 > mouseX && mouseX > pauseButtonX - pauseButtonWidth / 2
  && pauseButtonY + pauseButtonHeight / 2 > mouseY && mouseY > pauseButtonY - pauseButtonHeight / 2)
    pause();
}

function mousePressed(){
  if(dist(mouseX, mouseY,  noiseBarrierSliderX(), noiseBarrierSliderY()) < noiseBarrierSliderSize)
    dragNoiseBarrierSlider = true;
}

function mouseReleased(){
  dragNoiseBarrierSlider = false;
}

function touchStarted(){
  if(dist(touches[0].x, touches[0].y,  noiseBarrierSliderX(), noiseBarrierSliderY()) < noiseBarrierSliderSize)
    dragNoiseBarrierSlider = true;

  /*if (pauseButtonX + pauseButtonWidth / 2 > touches[0].x && touches[0].x > pauseButtonX - pauseButtonWidth / 2
  && pauseButtonY + pauseButtonHeight / 2 > touches[0].y && touches[0].y > pauseButtonY - pauseButtonHeight / 2){
    pause();
  }*/
}

function touchesEnded(){
  dragNoiseBarrierSlider = false;
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

  startMicButton = createButton("Start Microphone");
  startMicButton.mousePressed(startPitchDetect);

  switchToNoteMode();
}

function alignElements(){

  cnv.resize(windowWidth, windowHeight);

  targetNoteSize = width / 10;
  targetNoteX = width / 2;
  targetNoteY = height /2;

  detectedNoteSize = width /20;
  detectedNoteX = sideMargin + detectedNoteSize / 2;
  detectedNoteY = detectedNoteSize;

  pauseButtonX = width / 2;
  pauseButtonY = height / 2 + 50;
  pauseButtonWidth = width -100;
  pauseButtonHeight = height - 50;

  modeButton.position(width - modeButton.width - sideMargin, topMargin);

  startMicButton.position(width / 2 - startMicButton.width / 2, topMargin);

}