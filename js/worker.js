onmessage = function (e) {
  let { columns, rows, board } = e.data;

  next = new Array(columns);
  for (let i = 0; i < columns; i++) {
    next[i] = new Array(rows);
  }

  // Cellular automaton logic
  for (let x = 1; x < columns - 1; x++) {
    for (let y = 1; y < rows - 1; y++) {
      let neighbors = 0;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          neighbors += board[x + i][y + j];
        }
      }
      neighbors -= board[x][y];
      if (board[x][y] == 1 && neighbors < 2) next[x][y] = 0;
      else if (board[x][y] == 1 && neighbors > 3) next[x][y] = 0;
      else if (board[x][y] == 0 && neighbors == 3) {
        next[x][y] = 1;
      } else next[x][y] = board[x][y];
    }
  }

  // Swap!
  let temp = board;
  board = next;
  next = temp;
  // console.log(next);
  postMessage({ next, board });
};
