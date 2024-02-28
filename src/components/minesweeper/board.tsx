import clsx from "clsx";
import { useCallback, useState } from "react";

interface BoardState {
  cells: Cell[][];
  mines: Set<SerializedCoordinate>;
}

interface Cell {
  adjacentMines: number;
  revealed: boolean;
}

type SerializedCoordinate = string;

const NUM_MINES = 10;

function getInitialBoardState(size: number): BoardState {
  const mines = new Set<SerializedCoordinate>();

  while (mines.size < NUM_MINES) {
    // generate random mine location
    const x = Math.floor(Math.random() * size);
    // double check docs? does random return 1?
    // 0.99 * 10 = 9.9 -> floor = 9
    const y = Math.floor(Math.random() * size);
    mines.add(`${x},${y}`);
  }

  const cells: Cell[][] = new Array(size).fill(null).map((_row) => {
    return new Array(size).fill(null).map((_) => ({
      adjacentMines: 0,
      revealed: false,
    }));
  });

  for (let rowIndex = 0; rowIndex < cells.length; rowIndex++) {
    const row = cells[rowIndex];

    for (let colIndex = 0; colIndex < row.length; colIndex++) {
      // updating adjacentMines in each cell
      let numAdjacentMines = 0;

      if (rowIndex !== 0) {
        // look upwards
        const northCoordinate = `${rowIndex - 1},${colIndex}`;
        if (mines.has(northCoordinate)) {
          numAdjacentMines++;
        }

        // check north diagonals
        if (colIndex !== 0) {
          // look NW
          const nwCoordinate = `${rowIndex - 1},${colIndex - 1}`;
          if (mines.has(nwCoordinate)) {
            numAdjacentMines++;
          }
        }

        if (colIndex !== cells.length) {
          // look NE
          const neCoordinate = `${rowIndex - 1},${colIndex + 1}`;
          if (mines.has(neCoordinate)) {
            numAdjacentMines++;
          }
        }
      }

      if (colIndex !== 0) {
        // look leftwards
        const westCoordinate = `${rowIndex},${colIndex - 1}`;
        if (mines.has(westCoordinate)) {
          numAdjacentMines++;
        }
      }

      if (rowIndex !== cells.length - 1) {
        // look downwards
        const southCoordinate = `${rowIndex + 1},${colIndex}`;
        if (mines.has(southCoordinate)) {
          numAdjacentMines++;
        }

        // check south diagonals
        if (colIndex !== 0) {
          // look SW
          const swCoordinate = `${rowIndex + 1},${colIndex - 1}`;
          if (mines.has(swCoordinate)) {
            numAdjacentMines++;
          }
        }

        if (colIndex !== cells.length) {
          // look SE
          const seCoordinate = `${rowIndex + 1},${colIndex + 1}`;
          if (mines.has(seCoordinate)) {
            numAdjacentMines++;
          }
        }
      }

      if (colIndex !== row.length - 1) {
        // look rightwards
        const eastCoordinate = `${rowIndex},${colIndex + 1}`;
        if (mines.has(eastCoordinate)) {
          numAdjacentMines++;
        }
      }

      console.log(rowIndex, colIndex, cells[rowIndex][colIndex]);
      cells[rowIndex][colIndex].adjacentMines = numAdjacentMines;
    }
  }

  return {
    cells,
    mines,
  };
}

/**
 * N.B. mutates board in place
 *
 * TODO: look at diagonal neighbors
 * TODO: reveal cells _next_ to those with adjacentMines === 0
 */
function revealCellsAndNeighbors(
  board: BoardState,
  originalRowIdx: number,
  originalColIdx: number,
) {
  board.cells[originalRowIdx][originalColIdx].revealed = true;

  const size = board.cells.length;

  if (board.cells[originalRowIdx][originalColIdx].adjacentMines === 0) {
    // use BFS to fill neighbors of all cells with 0 adjacentMines
    const queue: Array<[number, number]> = [];
    queue.push([originalRowIdx, originalColIdx]);

    const seen = new Set<SerializedCoordinate>();

    while (queue.length > 0) {
      const [rowIdx, colIdx] = queue.shift()!;

      if (rowIdx > 0) {
        // look N
        const northCell = board.cells[rowIdx - 1][colIdx];
        if (!seen.has(`${rowIdx - 1},${colIdx}`) && northCell.adjacentMines === 0) {
          northCell.revealed = true;
          queue.push([rowIdx - 1, colIdx]);
        }
      }

      if (rowIdx < size - 1) {
        // look S
        const southCell = board.cells[rowIdx + 1][colIdx];
        if (!seen.has(`${rowIdx + 1},${colIdx}`) && southCell.adjacentMines === 0) {
          southCell.revealed = true;
          queue.push([rowIdx + 1, colIdx]);
        }
      }

      if (colIdx > 0) {
        // look W
        const westCell = board.cells[rowIdx][colIdx - 1];
        if (!seen.has(`${rowIdx},${colIdx}`) && westCell.adjacentMines === 0) {
          westCell.revealed = true;
          queue.push([rowIdx, colIdx - 1]);
        }
      }

      if (colIdx < size - 1) {
        // look E
        const eastCell = board.cells[rowIdx][colIdx + 1];
        if (!seen.has(`${rowIdx},${colIdx + 1}`) && eastCell.adjacentMines === 0) {
          eastCell.revealed = true;
          queue.push([rowIdx, colIdx + 1]);
        }
      }

      seen.add(`${rowIdx},${colIdx}`);
    }
  }
}

interface BoardProps {
  size?: number;
}

// square boards only
export default function Board({ size = 10 }: BoardProps) {
  const [boardState, setBoardState] = useState<BoardState>(() => getInitialBoardState(size));

  const hasMine = useCallback(
    (rowIdx: number, colIdx: number) => {
      return boardState.mines.has(`${rowIdx},${colIdx}`);
    },
    [boardState],
  );

  const revealCell = useCallback(
    (rowIdx: number, colIdx: number) => {
      const newBoardState = structuredClone(boardState);
      revealCellsAndNeighbors(newBoardState, rowIdx, colIdx);
      setBoardState(newBoardState);
    },
    [boardState],
  );

  return (
    <div className="board">
      {boardState.cells.map((row, rowIdx) => (
        <div className="row">
          {row.map((cell, colIdx) => (
            <div
              className={clsx("cell", { revealed: cell.revealed })}
              onClick={() => revealCell(rowIdx, colIdx)}
            >
              {hasMine(rowIdx, colIdx) ? "💣" : cell.adjacentMines}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
