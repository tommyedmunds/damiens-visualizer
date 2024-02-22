function map(value, a, b, c, d) {
  // first map value from (a..b) to (0..1)
  value = (value - a) / (b - a);
  // then map it from (0..1) to (c..d) and return it
  return c + value * (d - c);
}

onmessage = function (e) {
  // use when you want actual waveform
  // let y = map(yCoord * 2, 0, width, 0, rows);
  const { yCoord, xCoord, columns, rows, next, width, board } = e.data;

  const y = map(yCoord * 2, 0, width, 0, rows);
  const x = map(xCoord, 0, width / 2, 0, columns);

  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      // Lining the edges with 0s
      if (i == 0 || j == 0 || i == columns - 1 || j == rows - 1) board[i][j] = 0;
      // Filling the rest reactively
      else if (yCoord < 525) {
        // interesting form, takes actual shape of waveform
        if (j > y && j < y + 1 && i > x && i < x + 1) {
          board[i][j] = 1;
        }

        // if (j === Math.floor(y - 1)) {
        //   board[i][j] = 1;
        // }
      } else {
        // if (!yCoord && !xCoord) {
        //   board[i][j] = Math.floor(Math.random(2));
        // }

        if (i > x && i < x + 1) {
          board[i][j] = 1;
        }

        next[i][j] = 0;
      }
    }
  }

  postMessage({ yCoord, xCoord, columns, rows, next, width, board });
};
