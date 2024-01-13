let song;
function preload() {
  // song = loadSound('../assets/uzeless.mp3');
  // song = loadSound('../assets/thejudge.mp3');
  song = loadSound(
    'https://tommyedmunds.github.io/damiens-visualizer/assets/uzeless.mp3'
  );
}

let w;
let columns;
let rows;
let board;
let next;
let peakDetect;
let x = 0;
let y = 0;
let h = 0;

let waveform = [];

let xSpec = 0;

let amplitude;

const livingSquares = [];

function setup() {
  // Set simulation framerate to 10 to avoid flickering
  frameRate(120);
  createCanvas(windowWidth, windowHeight);

  song.loop();
  song.pause();

  // create a new Amplitude analyzer
  analyzer = new p5.Amplitude();

  // Patch the input to an volume analyzer
  analyzer.setInput(song);

  amplitude = new p5.Amplitude();

  // Connect the Amplitude analyzer to the song
  amplitude.setInput(song);

  fft = new p5.FFT();
  peakDetect = new p5.PeakDetect();

  button = createButton(`${windowWidth}, ${windowHeight}`);

  button.mousePressed(togglePlaying);

  initButton = createButton('shake it up');

  initButton.mousePressed(init);

  fft = new p5.FFT();
  song.amp(0.2);

  w = 10;
  // Calculate columns and rows
  columns = floor(width / w);
  rows = floor(height / w);
  // Wacky way to make a 2D array is JS
  board = new Array(columns);
  for (let i = 0; i < columns; i++) {
    board[i] = new Array(rows);
  }
  // Going to use multiple 2D arrays and swap them
  next = new Array(columns);
  for (i = 0; i < columns; i++) {
    next[i] = new Array(rows);
  }
  init();
}

const xThresh = 0.48;
const yThresh = 0.8;

let angle = 0;

function draw() {
  background(255);
  waveform = fft.waveform();

  peakDetect.update(fft);

  if (song.isPlaying()) {
    for (i = 0; i < waveform.length / 2; i++) {
      x = map(i, 0, waveform.length, 0, width);
      y = map(waveform[i], -1, 1, 0, height) + sin(angle) * 20;
      angle += random(0, 1);
      init(y, x);
    }
  }
  generate();

  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      if (board[i][j] == 1) {
        fill(0); // Set the color based on y
      } else {
        fill(255);
      }
      noStroke();
      // rect(i * w, j * w, w - 1, w - 1);
      rect(i * w, j * w, w, w);
    }
  }
}

function calcWidth(x, rows, columns) {
  if (!x) x = 0;
  const spaceLeft = map(x, 0, rows, 0, 0.49);
  const spaceRight = 1 - spaceLeft;
  return [columns * spaceLeft, columns * spaceRight];
}

// Fill board randomly
function init(yCoord, xCoord) {
  let y = map(yCoord, 0, width, 0, rows) + 20;
  // let y = map(yCoord, 0, windowWidth, 0, rows);
  const x = map(xCoord, 0, width / 2, 0, columns);

  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      // Lining the edges with 0s
      if (i == 0 || j == 0 || i == columns - 1 || j == rows - 1) board[i][j] = 0;
      // Filling the rest reactively
      else if (yCoord < 525) {
        // interesting form
        if (j > y && j < y + 1 && i > x && i < x + 1) {
          board[i][j] = 1;
        }
      } else {
        if (!yCoord && !yCoord) {
          board[i][j] = floor(random(2));
        }

        if (i > x && i < x + 1) {
          board[i][j] = 1;
        }

        next[i][j] = 0;
      }
    }
  }
}

// The process of creating the new generation
function generate() {
  // Loop through every spot in our 2D array and check spots neighbors
  for (let x = 1; x < columns - 1; x++) {
    for (let y = 1; y < rows - 1; y++) {
      // Add up all the states in a 3x3 surrounding grid
      let neighbors = 0;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          neighbors += board[x + i][y + j];
        }
      }

      // A little trick to subtract the current cell's state since
      // we added it in the above loop
      neighbors -= board[x][y];
      // Rules of Life
      if (board[x][y] == 1 && neighbors < 2) next[x][y] = 0; // Loneliness
      else if (board[x][y] == 1 && neighbors > 3) next[x][y] = 0; // Overpopulation
      else if (board[x][y] == 0 && neighbors == 3) {
        next[x][y] = 1;
      } // Reproduction
      else next[x][y] = board[x][y]; // Stasis
    }
  }

  // Swap!
  let temp = board;
  board = next;
  next = temp;
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
