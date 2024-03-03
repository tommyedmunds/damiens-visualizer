let golShader;
let song;
let prevFrame;
let waveform;

let prevX = 0;
let prevY = 0;

const density = 1;

const verticalParticles = [];

let ready = true;
let storedMilliseconds = 0;

let ready2 = true;
let storedMilliseconds2 = 0;

let ready3 = true;
let storedMilliseconds3 = 0;

let angle = 0;

function preload() {
  golShader = loadShader('js/gol.vert', 'js/gol.frag');
  song = loadSound(
    'https://tommyedmunds.github.io/damiens-visualizer/assets/damiensregicide.mp3'
  );
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  pixelDensity(density);
  background(0);
  stroke(255);
  prevFrame = createGraphics(width, height);
  prevFrame.pixelDensity(density);
  prevFrame.noSmooth();

  shader(golShader);
  golShader.setUniform('normalRes', [density / width, density / height]);

  fft = new p5.FFT();
  let button = createButton('play song');

  button.mousePressed(togglePlay);
}

function draw() {
  translate(-width / 2, -height / 2, 0);
  waveform = fft.waveform();

  if (frameCount % 200 === 0) {
    console.log('clear');
    clear();
  }
  if (song.isPlaying()) {
    for (let i = 0; i < waveform.length; i++) {
      let x = map(i, 0, waveform.length, 0, width);
      let y = map(waveform[i] / 1.4, -1, 1, 0, height);

      if (y > 550) {
        let heightVar = 0;

        if (Math.abs(millis() - storedMilliseconds) > 15) {
          ready = true;
        }

        if (ready) {
          console.log('fired', y);
          // line(width / 2, 0, 100, width / 2, height, 100);
          strokeWeight(50);
          line(0, x, 100, width, x, 100);
          // if (y % 5 === 0) {

          // } else {
          //   strokeWeight(50);
          //   line(width / 2, 0, 100, width / 2, height, 100);
          // }

          ready = false;
          storedMilliseconds = millis();
        }
        // for (let j = 0; j < 50; j++) {
        //   // point(x, random(0, height), 1);
        //   point(width / 2, heightVar, 1);
        //   heightVar += height / 57;

        //   if (heightVar > height) {
        //     heightVar = random(0, height - 200);
        //   }
        // }

        // for (let i = 1; i < height * 0.01; i++) {
        //   stroke(color(random(0, 255), random(0, 255), random(0, 255)));
        //   strokeWeight(3);
        //   point(x * 3, random(0, y) * 2);
        // }
      } else {
        // for (let j = 0; j < 2; j++) {
        // point(x, y, 1);
        // }
        const sWeight = map(x, 0, width, 100, 300);
        if (Math.abs(millis() - storedMilliseconds2) > 10) {
          ready2 = true;
        }

        if (ready2) {
          // line(width * 0.25, y, 100, width * 0.25, y + 50, 100);
          strokeWeight(sWeight);
          line(width * 0.25, y, 100, width * 0.25, y + sWeight, 100);
          ready2 = false;
          storedMilliseconds2 = millis();
        }

        if (Math.abs(millis() - storedMilliseconds3) > 10) {
          ready3 = true;
        }

        if (ready3) {
          strokeWeight(sWeight);
          line(width * 0.75, y, 100, width * 0.75, y + sWeight, 100);

          ready3 = false;
          storedMilliseconds3 = millis();
        }

        // point(width * 0.25, y, 1);
        // point(width * 0.75, y, 1);
      }
    }
  }

  // Copy the rendered image into our prevFrame image
  prevFrame.image(get(), 0, 0);
  // Set the image of the previous frame into our shader
  golShader.setUniform('tex', prevFrame);

  // Give the shader a surface to draw on
  rect(-width / 2, -height / 2, width, height);
}

function togglePlay() {
  if (song.isPlaying()) {
    song.pause();
  } else {
    song.loop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
