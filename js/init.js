function map(value, a, b, c, d) {
  // first map value from (a..b) to (0..1)
  value = (value - a) / (b - a);
  // then map it from (0..1) to (c..d) and return it
  return c + value * (d - c);
}

onmessage = function (e) {
  // use when you want actual waveform
  // let y = map(y * 2, 0, width, 0, rows);
  const { y, x, columns, rows, next, width, height, board } = e.data;
  const mappedY = map(y, 0, height, 0, rows);
  const mappedX = map(x, 0, width, 0, columns);

  console.log(y, x, mappedX, mappedY, e.data);
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      // Lining the edges with 0s
      if (i == 0 || j == 0 || i == columns - 1 || j == rows - 1) board[i][j] = 0;
      // Filling the rest reactively
      else if (y < 525) {
        // interesting form, takes actual shape of waveform
        if (Math.floor(y) % 17 !== 0) {
          if (j > mappedY && j < mappedY + 1 && i > mappedX && i < mappedX + 1) {
            board[i][j] = 1;
          }
        } else {
          if (j === Math.floor(mappedY - 1)) {
            board[i][j] = 1;
          }
        }
      } else {
        // if (!y && !mappedx) {
        //   board[i][j] = Math.floor(Math.random(2));
        // }

        if (i > mappedX && i < mappedX + 1) {
          board[i][j] = 1;
        }

        next[i][j] = 0;
      }
    }
  }

  postMessage({ next, board });
};
