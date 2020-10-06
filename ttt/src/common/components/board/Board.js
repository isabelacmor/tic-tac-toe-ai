import React from "react";
import GameCell, { PLAYER, AI } from "../game-cell/GameCell";
import "./Board.css";

export const TIE = "TIE";

class Board extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      game: [null, null, null, null, null, null, null, null, null],
      isWon: null,
      aiScore: 0,
      playerScore: 0,
    };
  }

  render() {
    return (
      <div className="mainContainer">
        <div className="scoreboard">{this.generateScoreboard()}</div>
        <div className="gameContainer">
          <div className="winnerBanner">{this.generateWinnerBanner()}</div>
          <div className="board">
            {this.state.game.map((cell, index) => {
              return (
                <GameCell
                  key={`cell-${index}`}
                  value={cell}
                  cellIndex={index}
                  onClick={
                    this.state.isWon === null
                      ? () => this.handlePlayerMove(index)
                      : undefined
                  }
                />
              );
            })}
          </div>
          <button
            className="reset"
            onClick={() =>
              this.setState({
                game: [null, null, null, null, null, null, null, null, null],
                isWon: null,
              })
            }
          >
            Reset
          </button>
        </div>
      </div>
    );
  }

  handlePlayerMove = (index) => {
    this.setState((prevState) => {
      let newScores = {};
      // Create a new board state from the player's move
      let newGame = Object.assign([], prevState.game);
      newGame[index] = PLAYER;

      // Do the AI move on top of it
      newGame = this.getNextMove(newGame);

      // Determine if there is a winner and update their score if so
      const isWon = this.checkWin(newGame);
      if (isWon === AI) {
        newScores.aiScore = prevState.aiScore + 1;
      } else if (isWon === PLAYER) {
        newScores.playerScore = prevState.playerScore + 1;
      }

      return { game: newGame, isWon, ...newScores };
    });
  };

  recurseMinimax = (board, player) => {
    var winner = this.checkWin(board);
    if (winner === AI) {
      return { score: 1, board };
    } else if (winner === PLAYER) {
      return { score: -1, board };
    } else if (this.getAvailableCells(board).length === 0) {
      return { score: 0, board };
    } else {
      // Next states
      var nextVal = null;
      var nextBoard = null;

      for (var i = 0; i < board.length; i++) {
        if (board[i] === null) {
          board[i] = player;

          var value = this.recurseMinimax(
            board,
            player === PLAYER ? AI : PLAYER
          ).score;
          if (
            (player === AI && (nextVal == null || value > nextVal)) ||
            (player === PLAYER && (nextVal == null || value < nextVal))
          ) {
            nextBoard = Object.assign([], board);
            nextVal = value;
          }
          board[i] = null;
        }
      }
      return { score: nextVal, board: nextBoard };
    }
  };

  getAvailableCells = (gameState) => {
    const availableCells = gameState.reduce((acc, item, index) => {
      if (item === null) {
        acc.push(index);
      }
      return acc;
    }, []);

    return availableCells;
  };

  checkWin = (gameState) => {
    const possibleWins = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < possibleWins.length; i++) {
      const [a, b, c] = possibleWins[i];
      if (
        gameState[a] !== null &&
        gameState[a] === gameState[b] &&
        gameState[a] === gameState[c]
      ) {
        return gameState[a];
      }
    }

    if (this.getAvailableCells(gameState).length === 0) {
      return TIE;
    }

    return null;
  };

  getNextMove = (gameState) => {
    return this.recurseMinimax(gameState, AI).board;
  };

  generateWinnerBanner = () => {
    if (this.state.isWon === null) {
      return null;
    } else if (this.state.isWon === AI) {
      return <span>AI wins</span>;
    } else if (this.state.isWon === PLAYER) {
      return <span>You win</span>;
    } else {
      return <span>It's a tie</span>;
    }
  };

  generateScoreboard = () => {
    return (
      <>
        <span>AI: {this.state.aiScore}</span>
        <span>You: {this.state.playerScore}</span>
      </>
    );
  };
}

export default Board;
