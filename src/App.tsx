import { useState } from "react";
import "./App.css";

type SquareValue = "x" | "o" | null;
type SquareProps = {
  value: SquareValue;
  onSquareClick: () => void;
};

function Square({ value, onSquareClick }: SquareProps) {
  return (
    <button className="square" onClick={onSquareClick}>
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
      return squares[a];
    }
  }
}

function App() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState<SquareValue[]>(Array(9).fill(null));
  const winner = calculateWinner(squares);

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

    setXIsNext(!xIsNext);
    setSquares(nextSquares);
  }

  let status: string;
  if (winner) status = `Winner: ${winner}`;
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
          />
        ))}
      </div>
      {status}
    </>
  );
}

export default App;
