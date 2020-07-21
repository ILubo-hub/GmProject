document.addEventListener("click", function mousePressed() { getAudioContext().resume() }, false);

let pitch;
let audioContext;
let mic;
let freq = 0;
let threshold= 1;
let canvas;
let ctx;
let notes = [
  {note: 'E', Freq: 82.40},
  {note: 'A', Freq: 110},
  {note: 'D', Freq: 146.83},
  {note: 'G', Freq: 196},
  {note: 'B', Freq: 246.94},
  {note: 'E3', Freq: 329.63}
];


function setup(){
  canvas = document.getElementById("canvas");
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
  }
  pitch.getPitch(gotPitch);
}

function modelLoaded(){
  console.log('model loaded');
  pitch.getPitch(gotPitch);
}

function draw(){
  background(0);
  let canvas = document.getElementById("canvas");
  textAlign(CENTER, CENTER);
  fill(255,255,0);
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
    text("You are tunning the note "+ closestNote.note + " Try to get it as close as possible to " + closestNote.Freq, width/2, height-100);
  
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

function draw2(){
  createCanvas(400,400);
  text(freq.toFixed(2), width/2, height-100);
  let diff = freq - 440;
  fill(255);
  rect(200, 100, diff, 50);
}