import { useState } from "react";
import "./App.css";

type SquareValue = "x" | "o" | null;

type SquareProps = {
  value: SquareValue;
  onSquareClick: () => void;
  isWinningSquare: boolean;
  disable: boolean;
};

function Square({
  value,
  onSquareClick,
  disable,
  isWinningSquare,
}: SquareProps) {
  return (
    <button
      className={`square ${isWinningSquare && "winning-square"}`}
      onClick={onSquareClick}
      disabled={disable}
    >
      {value}
    </button>
  );
}

function calculateWinner(squares: SquareValue[]) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];

    if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
      return { winner: squares[a], line: lines[i] };
    }
  }
}

type BoardProps = {
  xIsNext: boolean;
  squares: SquareValue[];
  onPlay: (nextSquares: SquareValue[]) => void;
};

function Board({ xIsNext, squares, onPlay }: BoardProps) {
  const winnerLine = calculateWinner(squares);

  function handleClick(i: number) {
    // Ignore the click if the game is over or the square is already filled.
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    // Make a copy of squares
    const nextSquares = squares.slice();

    if (xIsNext) {
      nextSquares[i] = "x";
    } else {
      nextSquares[i] = "o";
    }

    onPlay(nextSquares);
  }

  let status: string;
  if (winnerLine) status = `Winner: ${winnerLine.winner}`;
  else if (squares.every(Boolean)) status = "Draw";
  else status = `Next Player: ${xIsNext ? "x" : "o"}`;

  return (
    <>
      <div className="square-container">
        {squares.map((square, index) => (
          <Square
            key={index}
            value={square}
            onSquareClick={() => handleClick(index)}
            disable={winnerLine ? true : false}
            isWinningSquare={winnerLine?.line.includes(index) ? true : false}
          />
        ))}
      </div>
      {status}
    </>
  );
}

function Game() {
  const [history, setHistory] = useState<SquareValue[][]>([
    Array(9).fill(null),
  ]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;

  function handlePlay(nextSquares: SquareValue[]) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove: number) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((_, move) => {
    let description;
    if (move > 0) {
      description = `Go to move #${move}`;
    } else {
      description = "Go to game start";
    }

    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <>
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </>
  );
}

export default Game;
