import React from 'react';
import './App.css';

function Square(props: any) {
  return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
  );
}

function Board(props: { squares: number[]; onClick: (i: number, j: number) => void }) {
  function renderSquare(i: number, j: number) {
    return (
        <Square
            value={props.squares[i]}
            onClick={() => props.onClick(i, j)}
        />
    );
  }
  return (
      <div>
        <div className="board-row">
          {renderSquare(0, 0)}
          {renderSquare(1, 0)}
          {renderSquare(2, 0)}
        </div>
        <div className="board-row">
          {renderSquare(3, 1)}
          {renderSquare(4, 1)}
          {renderSquare(5, 1)}
        </div>
        <div className="board-row">
          {renderSquare(6, 2)}
          {renderSquare(7,2)}
          {renderSquare(8, 2)}
        </div>
      </div>
  );

}


interface State {
  history: any;
  stepNumber: number;
  xIsNext: boolean;
}

export class Game extends React.Component<any, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        locale: {x: 0, y: 0}
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i: number, j: number) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length -1];
    const squares = current.squares.slice();
    const locale = {x: i, y: j};
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';

    this.setState({
      history: history.concat([{
        squares: squares,
        locale: locale
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    }, () => {console.log(this.state.history)});

  }

  jumpTo(step: number) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step: number, move: number) => {
      const desc = move ?
          'Go to move #' + move + ' location: ' + history[move].locale.x + ', '+ history[move].locale.y :
          'Go to game start';

      return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
        <div className="game">
          <div className="game-board">
            <Board
                squares={current.squares}
                onClick={(i: number, j: number) => this.handleClick(i, j)}
            />
          </div>
          <div className="game-info">
            <div>{ status }</div>
            <ol>{ moves }</ol>
          </div>
        </div>
    );
  }
}

export const lines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function calculateWinner(squares: any[]) {
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}