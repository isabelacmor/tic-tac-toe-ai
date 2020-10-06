import React from "react";
import "./GameCell.css";

export const PLAYER = "X";
export const AI = "O";

const generateBorderClassName = (cell) => {
  let borderClass = "";
  // Top row
  if (cell === 0 || cell === 1 || cell === 2) {
    borderClass += " squareNoTop";
  }
  // Bottom row
  if (cell === 6 || cell === 7 || cell === 8) {
    borderClass += " squareNoBottom";
  }
  // Left column
  if (cell === 0 || cell === 3 || cell === 6) {
    borderClass += " squareNoLeft";
  }
  // Right column
  if (cell === 2 || cell === 5 || cell === 8) {
    borderClass += " squareNoRight";
  }

  return borderClass;
};

function GameCell({ value, cellIndex, onClick }) {
  return (
    <button
      className={`square ${generateBorderClassName(cellIndex)} ${
        value === PLAYER ? "player" : "ai"
      }`}
      onClick={onClick}
      disabled={value !== null || onClick === undefined}
    >
      {value}
    </button>
  );
}

export default GameCell;
