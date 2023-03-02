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

let micButtonSize;
let contextButtonX;
let contextButtonY;
let contextButtonWidth;
let contextButtonHeight;
let modeButton;
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

  setupElements();

  monoSynth = new p5.MonoSynth();
  synthFft = new p5.FFT();
  synthFft.setInput(monoSynth);

  
}


function draw() {
  alignElements();
  background(0);


  //BUG hat was mit if else statement zu tun
  if (!enabledPitchDetection)
    displayMicrophoneButton();
  else
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
    drawVolumeMeter();  
    play();
  }

  drawNoiseBarrierSlider();

  //showContextButton();


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

function pressContextButton(){
    if (!enabledPitchDetection){
      startPitchDetect();
    }
    pause();
}


function showContextButton(){
      //SHOW PAUSE BUTTON
      rectMode(CENTER);
      fill(255, 0, 0);
      rect(contextButtonX, contextButtonY, contextButtonWidth, contextButtonHeight);
}

function nextNote(){
  currentNote = random(notes);
  //playSynth();
}

function displayTargetNote(){

  textSize(targetNoteSize);
  fill(255, 230);

  
    if (displayInterval)
      text(intervals[notes.indexOf(currentNote)], targetNoteX, targetNoteY);
    else
      text(currentNote, targetNoteX, targetNoteY);

}

function displayDetectedNote(){

  textSize(detectedNoteSize);
  fill(255, 200);


  if (detectedNote != "unidentified"){
    if (displayInterval)
      text(intervals[notes.indexOf(detectedNote)], detectedNoteX, detectedNoteY);
    else
      text(detectedNote, detectedNoteX, detectedNoteY);
  }
}

function displayMicrophoneButton(){

  image(img, width /2 - micButtonSize /2, height / 2 - micButtonSize / 2, micButtonSize, micButtonSize);

}

function keyPressed(){
  if(key == " ")
    pressContextButton();
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

function drawVolumeMeter(){
  
  rectMode(CORNER);
  fill(10, 180, 255, 200);
  rect(volumeMeterX(), volumeMeterY(), volumeMeterWidth, -volume * volumeMeterDisplayAmp);
}

function drawNoiseBarrierSlider(){
  
  fill(255, 180);
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

  if (contextButtonX + contextButtonWidth / 2 > mouseX && mouseX > contextButtonX - contextButtonWidth / 2
  && contextButtonY + contextButtonHeight / 2 > mouseY && mouseY > contextButtonY - contextButtonHeight / 2)
    pressContextButton();
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

let img;
function setupElements(){
  textAlign(CENTER);

  //micButton = createImg('mic-button.png', "Microphone Button", "", onLoadMicButton);

  switchToNoteMode();
}


function preload() {
  // preload() runs once
  img = loadImage('mic-button.png');
}

function onLoadMicButton(){
  print('Microphone Button loaded successfully');
}

function alignElements(){

  cnv.resize(windowWidth, windowHeight);

  micButtonSize  = width / 3;

  targetNoteSize = width / 10;
  targetNoteX = width / 2;
  targetNoteY = height /2;

  detectedNoteSize = width /20;
  detectedNoteX = sideMargin + detectedNoteSize / 2;
  detectedNoteY = detectedNoteSize;

  contextButtonX = width / 2 - 50;
  contextButtonY = height / 2 + 50;
  contextButtonWidth = width;
  contextButtonHeight = height;

  modeButton.position(width - modeButton.width - sideMargin, topMargin);

}