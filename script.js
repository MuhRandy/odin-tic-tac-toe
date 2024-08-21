function Gameboard() {
  const board = [];
  const size = 3;

  for (let i = 0; i < size; i++) {
    board[i] = [];
    for (let j = 0; j < size; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  const getBoardSize = () => size;

  const printBoard = () => {
    const boardWithCellValue = board.map((row) =>
      row.map((cell) => cell.getValue())
    );

    console.log(boardWithCellValue);
  };

  const markCell = (row, column, playerMark) => {
    const cellValue = board[row][column].getValue();

    if (cellValue !== "") return "Already marked";

    board[row][column].addMark(playerMark);
  };

  return { getBoard, getBoardSize, printBoard, markCell };
}

function Cell() {
  let value = "";

  const getValue = () => value;

  const addMark = (playerMark) => {
    value = playerMark;
  };

  return { getValue, addMark };
}

function gameController(playerOne = "Player One", playerTwo = "Player Two") {
  const board = Gameboard();
  const players = [
    { name: playerOne, mark: "x" },
    { name: playerTwo, mark: "o" },
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer === players[0]
      ? (activePlayer = players[1])
      : (activePlayer = players[0]);
  };

  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  const isPlayerWin = (playerMark, boardSize) => {
    let activePlayerMarkNumber;

    const firstDiagonal = [];
    const secondDiagonal = [];

    const isPlayerWinOnDiagonal = (i) => {
      firstDiagonal.push(board.getBoard()[i][i].getValue());

      activePlayerMarkNumber = firstDiagonal.filter(
        (cell) => cell === playerMark
      ).length;

      if (activePlayerMarkNumber === boardSize) return true;

      const lastIndex = boardSize - 1;
      secondDiagonal.push(board.getBoard()[i][lastIndex - i].getValue());

      activePlayerMarkNumber = secondDiagonal.filter(
        (cell) => cell === playerMark
      ).length;

      if (activePlayerMarkNumber === boardSize) return true;
    };

    const isPlayerWinOnRow = (i) => {
      const row = board.getBoard()[i];

      activePlayerMarkNumber = row.filter(
        (cell) => cell.getValue() === playerMark
      ).length;

      if (activePlayerMarkNumber === boardSize) return true;
    };

    const isPlayerWinOnColumn = (i) => {
      const column = [];

      for (let j = 0; j < boardSize; j++) {
        column.push(board.getBoard()[j][i].getValue());
      }

      activePlayerMarkNumber = column.filter(
        (cell) => cell === playerMark
      ).length;

      if (activePlayerMarkNumber === boardSize) return true;
    };

    for (let i = 0; i < board.getBoardSize(); i++) {
      if (isPlayerWinOnDiagonal(i)) return true;

      if (isPlayerWinOnRow(i)) return true;

      if (isPlayerWinOnColumn(i)) return true;
    }

    return false;
  };

  const playRound = (row, column) => {
    if (
      board.markCell(row, column, getActivePlayer().mark) === "Already marked"
    )
      return console.log("Cell Already Marked, please choose other cell!");

    console.log(`${getActivePlayer().name} mark into cell ${row}${column}...`);

    board.markCell(row, column, getActivePlayer().mark);

    if (isPlayerWin(getActivePlayer().mark, board.getBoardSize()))
      return console.log(`${getActivePlayer().name} win`);

    switchPlayerTurn();
    printNewRound();
  };

  printNewRound();

  return { playRound, getActivePlayer };
}

const game = gameController();
