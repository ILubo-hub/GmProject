/*var mic;
function setup(){
    mic = new p5.AudioIn();
    mic.start();
    createCanvas(windowWidth, windowHeight);
}
function draw(){
    var val = mic.getLevel();
    val = parseInt(map(val, 0, 0.5, 1, 20));
    background('rgba(0, 0, 0, 0.2)');
    fill(255);
    p5.FFT
    translate(-200, 0);
    for(i = 0; i < val; i++){
        rect(i*50, 0, 20, -i*50);
    }

    translate(400, 0);
    for(i = 0; i < val; i++){
        rect(-i*50, 0, 20, i*50);
    }
}*/


/*
var mic;
function preload(){
    //sound = loadSound('sound2.mp3');
  }
  
  function setup(){
    let cnv = createCanvas(windowWidth,windowHeight);
    cnv.mouseClicked(togglePlay);
    fft = new p5.FFT();
    mic = new p5.AudioIn();
    fft.setInput(mic);
    //sound.amp(0.2);

  }

  function draw(){
    background(220);
  
    let spectrum = fft.analyze();
    noStroke();
    fill(255, 0, 255);
    for (let i = 0; i< spectrum.length; i++){
      let x = map(i, 0, spectrum.length, 0, width);
      let h = -height + map(spectrum[i], 0, 255, height, 0);
      rect(x, height, width / spectrum.length, h )
    }
  
    let waveform = fft.waveform();
    noFill();
    beginShape();
    stroke(20);
    for (let i = 0; i < waveform.length; i++){
      let x = map(i, 0, waveform.length, 0, width);
      let y = map( waveform[i], -1, 1, 0, height);
      vertex(x,y);
    }
    endShape();
  
    text('tap to play', 20, 20);
  }
  
  function togglePlay() {
        mic.start();
      //sound.pause();
  }*/
/*

  let mic, fft;

function setup() {
  createCanvas(windowWidth-100,windowHeight-100);
  noFill();
  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT();
  fft.setInput(mic);
}

function draw() {
  background(200);

  let spectrum = fft.analyze();


  beginShape();
  for (i = 0; i < spectrum.length; i++) {
    vertex(i, map(spectrum[i], 0, 255, height, 0));
  }
  endShape();
}
*/

// waveform

/*
let mic, fft;

function setup() {
  createCanvas(windowWidth-100,windowHeight-100);
  noFill();
  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT();
  fft.setInput(mic);
}

function draw() {
  background(200);

  


let spectrum = fft.analyze();
  noStroke();
  fill(255, 0, 255);
  for (i = 0; i < spectrum.length; i++) {
    let x = map(i, 0, spectrum.length, 0, width);
    let h = -height + map(spectrum[i], 0, 255, height, 0);
    rect(x, height, width / spectrum.length, h )
  }


  //Good

  let waveform = fft.waveform();
  
  beginShape();
  stroke(20);
  for (let i = 0; i < waveform.length; i++){
    let x = map(i, 0, waveform.length, 0, width);
    let y = map( waveform[i], -1, 1, 0, height);

    vertex(x,y);
  }
  endShape();
}
*/



// ml5


document.addEventListener("click", function mousePressed() { getAudioContext().resume() }, false);

let pitch;
let audioContext;
let mic;
let freq = 0;
let threshold= 1;
let notes = [
  {note: 'E', Freq: 82.40},
  {note: 'A', Freq: 110},
  {note: 'D', Freq: 146.83},
  {note: 'G', Freq: 196},
  {note: 'B', Freq: 246.94},
  {note: 'E3', Freq: 329.63}
];


function setup(){
  createCanvas(400,400);
  try{
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    audioContext = getAudioContext();
  }
  catch(e){
    alert("La API no funciona, lo siento", e);
  }
  mic = new p5.AudioIn();
  mic.start(listening);
}

function listening(){
  console.log('listening');
    pitch = ml5.pitchDetection(
      '/crepe/',
      audioContext,
      mic.stream,
      modelLoaded,
    );
}

function gotPitch(error, frequency){
  if(error){
    console.error(error);
  }else{
    if(frequency){
      freq = frequency
    }
    //console.log(frequency);
  }
  pitch.getPitch(gotPitch);
}

function modelLoaded(){
  console.log('model loaded');
  pitch.getPitch(gotPitch);
}

function draw(){
  background(0);
  textAlign(CENTER, CENTER);
  fill(255);
  text(freq.toFixed(2), width/2, height-150);
  

  let closestNote = -1;
  let recordDiff = Infinity;
  for (let i =0; i<notes.length; i++){
    let diff = freq - notes[i].Freq;
    if(abs(diff) < recordDiff){
      closestNote = notes[i];
      recordDiff = diff;
    }
  }
  text(closestNote.note, width/2, height-50);

  let diff = recordDiff;
  let note = notes[closestNote]
  let alpha = map(abs(diff), 0, 100, 255, 0);
  rectMode(CENTER);
  fill(255, alpha);
  stroke(255);
  strokeWeight(1);
  if(abs(diff)< threshold){
    fill(0, 255, 0);
  }
  rect(200, 100, 200, 50);

  stroke(255);
  strokeWeight(4);
  line(200,0,200,200);

  noStroke();
  fill(255,0,0);
  if(abs(diff)<threshold){
    fill(0,255,0);
  }
  
  rect(200 + diff/10, 100, 10, 75);
}
