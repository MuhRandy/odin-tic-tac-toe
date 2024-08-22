function Gameboard() {
  const board = [];
  const size = 3;

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

  const resetBoard = () => {
    for (let i = 0; i < size; i++) {
      board[i] = [];
      for (let j = 0; j < size; j++) {
        board[i].push(Cell());
      }
    }
  };

  resetBoard();

  return { getBoard, getBoardSize, printBoard, resetBoard, markCell };
}

function Cell() {
  let value = "";

  const getValue = () => value;

  const addMark = (playerMark) => {
    value = playerMark;
  };

  return { getValue, addMark };
}

function GameController(playerOne = "Player One", playerTwo = "Player Two") {
  const board = Gameboard();

  const Player = (name, mark) => {
    let score = 0;

    const getScore = () => score;
    const addScore = () => score++;
    return { name, mark, getScore, addScore };
  };

  const players = [Player(playerOne, "X"), Player(playerTwo, "O")];

  const getPlayers = () => players;

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

  const isPlayerWin = () => {
    let activePlayerMarkNumber;
    const playerMark = getActivePlayer().mark;
    const boardSize = board.getBoardSize();

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

    for (let i = 0; i < boardSize; i++) {
      if (isPlayerWinOnDiagonal(i)) return true;

      if (isPlayerWinOnRow(i)) return true;

      if (isPlayerWinOnColumn(i)) return true;
    }

    return false;
  };

  const isGameDraw = () => {
    const draw = board
      .getBoard()
      .map((row) => row.filter((cell) => cell.getValue() !== "").length);

    for (let i = 0; i < draw.length; i++) {
      if (draw[i] < board.getBoardSize()) return false;
    }

    return true;
  };

  const playRound = (row, column) => {
    if (
      board.markCell(row, column, getActivePlayer().mark) === "Already marked"
    )
      return console.log("Cell Already Marked, please choose other cell!");

    console.log(`${getActivePlayer().name} mark into cell ${row}${column}...`);

    board.markCell(row, column, getActivePlayer().mark);

    if (isGameDraw()) return console.log("Game draw");

    if (isPlayerWin()) {
      getActivePlayer().addScore();
      return console.log(`${getActivePlayer().name} win`);
    }

    switchPlayerTurn();
    printNewRound();
  };

  printNewRound();

  return {
    playRound,
    getActivePlayer,
    getPlayers,
    getBoard: board.getBoard,
    resetBoard: board.resetBoard,
    isPlayerWin,
    isGameDraw,
  };
}

function ScreenController() {
  const game = GameController();
  const playerTurnHeading = document.querySelector(".player-turn");
  const boardDiv = document.querySelector(".board");
  const dialog = document.querySelector("dialog");

  const updateScreen = () => {
    // get newest players score
    const players = game.getPlayers();
    const playerOneName = document.querySelector(".player-one-name");
    const playerTwoName = document.querySelector(".player-two-name");
    const playerOneMark = document.querySelector(".player-one-mark");
    const playerTwoMark = document.querySelector(".player-two-mark");

    playerOneName.textContent = players[0].name;

    playerOneMark.textContent = `${players[0].mark}: ${players[0].getScore()}`;

    playerTwoName.textContent = players[1].name;

    playerTwoMark.textContent = `${players[1].mark}: ${players[1].getScore()}`;

    // clear the board
    boardDiv.textContent = "";

    // get the newest version of the board and player turn
    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();

    // Display player's turn
    playerTurnHeading.textContent = `${activePlayer.name}'s turn...`;

    // Render board squares
    board.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        // Anything clickable should be a button!!
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        // Create a data attribute to identify the column
        // This makes it easier to pass into our `playRound` function
        cellButton.dataset.row = rowIndex;
        cellButton.dataset.column = columnIndex;
        cellButton.textContent = cell.getValue();
        boardDiv.appendChild(cellButton);
      });
    });
  };

  // Add event listener for the board
  function clickHandlerBoard(e) {
    const selectedRow = e.target.dataset.row;
    const selectedColumn = e.target.dataset.column;
    // Make sure I've clicked a column and not the gaps in between
    if (!selectedColumn || !selectedRow) return;

    game.playRound(selectedRow, selectedColumn);

    // check is the game over
    if (game.isPlayerWin() || game.isGameDraw()) {
      const dialogHeading = document.querySelector(".game-status h1");
      const dialogDiv = document.querySelector(".game-status div");

      dialogHeading.textContent = game.isPlayerWin()
        ? `${game.getActivePlayer().name}`
        : "Game";

      dialogDiv.textContent = game.isPlayerWin() ? "Win" : "Draw";

      dialog.show();
    }
    updateScreen();
  }

  function clickHandlerDialog() {
    game.resetBoard();
    updateScreen();
    dialog.close();
  }
  boardDiv.addEventListener("click", clickHandlerBoard);
  dialog.addEventListener("click", clickHandlerDialog);

  // Initial render
  updateScreen();

  // We don't need to return anything from this module because everything is encapsulated inside this screen controller.
}

ScreenController();
