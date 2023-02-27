let monoSynth;
let notes = ['C4', 'C#4', 'D4','D#4', 'E4', 'F4','F#4', 'G4','G#4', 'A4', 'A#4', 'B4'];
let currentNote;
let slider;

function setup() {
  let cnv = createCanvas(700, 700);
  textAlign(CENTER);
  textSize(400);

  slider = createSlider(0, 200, 100 , 1);
  slider.position(width / 2, 40);
  slider.style('width', '200px');

  monoSynth = new p5.MonoSynth();
}

function draw() {
  background(220);
  text(currentNote, width/2, height/2);

  console.log(frameCount);
  if (frameCount % slider.value() == 0) {
    playSynth();
  }

}

function playSynth() {
  userStartAudio();

  currentNote = random(notes);
  // note velocity (volume, from 0 to 1)
  let velocity = 1;
  // time from now (in seconds)
  let time = 0;
  // note duration (in seconds)
  let dur = 1/6;

  monoSynth.play(currentNote, velocity, time, dur);

}