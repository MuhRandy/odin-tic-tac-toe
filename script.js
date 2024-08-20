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

  const checkWinner = () => {
    const firstDiagonal = [];
    const secondDiagonal = [];

    for (let i = 0; i < board.getBoardSize(); i++) {
      // check diagonal
      firstDiagonal.push(board.getBoard()[i][i].getValue());

      if (
        firstDiagonal.filter((cell) => cell === getActivePlayer().mark)
          .length === board.getBoardSize()
      ) {
        console.log(`${getActivePlayer().name} win`);

        return true;
      }

      secondDiagonal.push(
        board.getBoard()[i][board.getBoardSize() - 1 - i].getValue()
      );

      if (
        secondDiagonal.filter((cell) => cell === getActivePlayer().mark)
          .length === board.getBoardSize()
      ) {
        console.log(`${getActivePlayer().name} win`);

        return true;
      }

      // check each row
      const row = board.getBoard()[i];

      if (
        row.filter((cell) => cell.getValue() === getActivePlayer().mark)
          .length === board.getBoardSize()
      ) {
        console.log(`${getActivePlayer().name} win`);

        return true;
      }

      // check each column
      const column = [];

      for (let j = 0; j < board.getBoardSize(); j++) {
        column.push(board.getBoard()[j][i].getValue());
      }

      if (
        column.filter((cell) => cell === getActivePlayer().mark).length ===
        board.getBoardSize()
      ) {
        console.log(`${getActivePlayer().name} win`);

        return true;
      }
    }

    return false;
  };

  const playRound = (row, column) => {
    if (
      board.markCell(row, column, getActivePlayer().mark) === "Already marked"
    )
      return console.log("Cell Already Marked, please choose other cell!");

    console.log(`${getActivePlayer().name} mark into cell ${row}-${column}...`);

    board.markCell(row, column, getActivePlayer().mark);

    if (checkWinner()) return;

    switchPlayerTurn();
    printNewRound();
  };

  printNewRound();

  return { playRound, getActivePlayer };
}

const game = gameController();

game.playRound(0, 0);
game.playRound(0, 1);
game.playRound(1, 1);
game.playRound(1, 0);
game.playRound(2, 2);
