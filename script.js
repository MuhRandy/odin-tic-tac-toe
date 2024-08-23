(function () {
  function Gameboard() {
    const board = [];
    const size = 3;

    const getBoard = () => board;

    const getBoardSize = () => size;

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

    return { getBoard, getBoardSize, resetBoard, markCell };
  }

  function Cell() {
    let value = "";

    const getValue = () => value;

    const addMark = (playerMark) => {
      value = playerMark;
    };

    return { getValue, addMark };
  }

  function GameController(playerOne = "Player one", playerTwo = "Player two") {
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

    const resetActivePlayer = () => (activePlayer = players[0]);

    const getActivePlayer = () => activePlayer;

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
        return "Already Marked";

      console.log(
        `${getActivePlayer().name} mark into cell ${row}${column}...`
      );

      board.markCell(row, column, getActivePlayer().mark);

      if (isGameDraw()) return console.log("Game draw");

      if (isPlayerWin()) {
        getActivePlayer().addScore();
        return console.log(`${getActivePlayer().name} win`);
      }

      switchPlayerTurn();
    };

    return {
      playRound,
      getActivePlayer,
      resetActivePlayer,
      getPlayers,
      getBoard: board.getBoard,
      resetBoard: board.resetBoard,
      isPlayerWin,
      isGameDraw,
    };
  }

  function ScreenController() {
    let game;
    const boardDiv = document.querySelector(".board");
    const dialog = document.querySelector("dialog");
    const restartButton = document.querySelector(".buttons .restart-game");
    const newGameButton = document.querySelector(".buttons .new-game");

    let isNewGame = true;

    const updateScreen = () => {
      if (isNewGame) {
        isNewGame = false;
        clickHandlerNewGame();
        return;
      }

      // get players data
      const players = game.getPlayers();
      const playerOne = document.querySelector(".player-one");
      const playerTwo = document.querySelector(".player-two");
      const playerOneName = document.querySelector(".player-one .name");
      const playerTwoName = document.querySelector(".player-two .name");
      const playerOneScore = document.querySelector(".player-one .score");
      const playerTwoScore = document.querySelector(".player-two .score");

      playerOneName.textContent = players[0].name;
      playerOneScore.textContent = players[0].getScore();

      playerTwoName.textContent = players[1].name;
      playerTwoScore.textContent = players[1].getScore();

      // clear the board
      boardDiv.textContent = "";

      // get the newest version of the board and player turn
      const board = game.getBoard();
      const activePlayer = game.getActivePlayer();

      // Display player's turn
      if (activePlayer.mark === "X") {
        playerTwo.classList.remove("active-player");
        playerOne.classList.add("active-player");
      } else {
        playerOne.classList.remove("active-player");
        playerTwo.classList.add("active-player");
      }

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
          if (cell.getValue() === "")
            cellButton.dataset.mark = activePlayer.mark;

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

      // Add element for dialog
      dialog.textContent = "";
      const div = document.createElement("div");
      const h2 = document.createElement("h2");
      const gameStatus = document.createElement("div");

      if (game.playRound(selectedRow, selectedColumn) === "Already Marked") {
        dialog.dataset.for = "warning";

        h2.textContent = "Cell already marked, please select other cell!";

        h2.style.fontSize = "1rem";

        div.appendChild(h2);

        dialog.appendChild(div);

        dialog.show();
      }

      game.playRound(selectedRow, selectedColumn);

      // check is the game over
      if (game.isPlayerWin() || game.isGameDraw()) {
        dialog.dataset.for = "game-status";

        h2.textContent = game.isPlayerWin()
          ? `${game.getActivePlayer().name}`
          : "Game";

        gameStatus.textContent = game.isPlayerWin() ? "Win" : "Draw";

        div.appendChild(h2);
        div.appendChild(gameStatus);

        dialog.appendChild(div);

        dialog.show();
      }

      updateScreen();
    }

    function clickHandlerDialog() {
      if (dialog.dataset.for === "game-status") {
        game.resetBoard();
        game.resetActivePlayer();
        updateScreen();
      }

      if (dialog.dataset.for === "new-game") return;

      dialog.close();
    }

    function clickHandlerRestart() {
      game.resetBoard();
      game.resetActivePlayer();
      updateScreen();
    }

    function clickHandlerNewGame() {
      dialog.textContent = "";
      dialog.dataset.for = "new-game";
      const form = document.createElement("form");
      const h2 = document.createElement("h2");
      const button = document.createElement("button");

      form.method = "dialog";

      h2.textContent = "Choose Player Name";

      button.textContent = "Start Game";

      const createLabelInput = (labelText, inputDefaultValue, id) => {
        const div = document.createElement("div");
        const label = document.createElement("label");
        const input = document.createElement("input");

        label.textContent = labelText;
        label.setAttribute("for", id);

        input.value = inputDefaultValue;
        input.id = id;

        div.appendChild(label);
        div.appendChild(input);

        return div;
      };

      const playerOneInput = createLabelInput(
        "Player One Name",
        "Player one",
        "player-one-name"
      );
      const playerTwoInput = createLabelInput(
        "Player Two Name",
        "Player two",
        "player-two-name"
      );

      button.addEventListener("click", () => {
        const playerOneNameInput = document.querySelector("#player-one-name");
        const playerTwoNameInput = document.querySelector("#player-two-name");
        const playerOneName = playerOneNameInput.value;
        const playerTwoName = playerTwoNameInput.value;

        game = GameController(playerOneName, playerTwoName);

        updateScreen();
      });

      form.appendChild(h2);
      form.appendChild(playerOneInput);
      form.appendChild(playerTwoInput);
      form.appendChild(button);

      dialog.appendChild(form);

      dialog.show();
    }

    boardDiv.addEventListener("click", clickHandlerBoard);
    dialog.addEventListener("click", clickHandlerDialog);
    restartButton.addEventListener("click", clickHandlerRestart);
    newGameButton.addEventListener("click", clickHandlerNewGame);

    updateScreen();
  }

  ScreenController();
})();
