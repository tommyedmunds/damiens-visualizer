let particles = [];
let particlesSpectrum = [];
const num = 400;

const noiseScale = 10;

let song, analyzer;
let r, g, b;
let mic, fft;

let x, y;

function preload() {
  song = loadSound('../assets/damiensregicide.mp3');
}

function setup() {
  createCanvas(displayWidth, displayHeight);

  song.loop();

  // create a new Amplitude analyzer
  analyzer = new p5.Amplitude();

  // Patch the input to an volume analyzer
  analyzer.setInput(song);

  fft = new p5.FFT();
  fft.setInput(mic);

  for (let i = 0; i < num; i++) {
    particles.push(createVector(random(width), random(height)));
    particlesSpectrum.push(createVector(random(width), random(height)));
  }

  button = createButton('play');
  button.mousePressed(togglePlaying);
  fft = new p5.FFT();
  song.amp(0.2);

  stroke(255);
}

function draw() {
  const randomNum = Math.round(random(1, 1000));
  const even = randomNum % 2 === 0;

  background(0, 150);
  var spectrum = fft.analyze();
  let waveform = fft.waveform();

  let spectrumX, spectrumY;

  for (i = 0; i < waveform.length / 2; i++) {
    x = map(i, 0, waveform.length, 0, displayWidth);
    y = map(waveform[i], -1, 1, 0, displayHeight);

    if (i < num) {
      let p = particles[i];
      let n = noise(x * noiseScale, y * noiseScale, x * noiseScale * noiseScale);
      let a = TAU * n;

      if (frameCount % 2 === 0 && y > 550) {
        for (let i = 1; i < height * 0.09; i++) {
          p.x = x;
          p.y += sin(a);
          stroke(color(random(0, 255), random(0, 255), random(0, 255)));
          strokeWeight(3);
          point(x * 3, random(0, p.y) * 2);
        }
      } else {
        stroke('white');
        strokeWeight(3);
        point(p.x, p.y);
      }

      if (song.isPlaying()) {
        p.x = map(x, 0, waveform.length, 0, width * 2);
        p.y = y;
      }
    }
  }
}

function togglePlaying() {
  if (!song.isPlaying()) {
    song.play();
    song.setVolume(0.8);
    button.html('pause');
  } else {
    song.pause();
    button.html('play');
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
