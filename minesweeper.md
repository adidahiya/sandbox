# Minesweeper

## Initial setup

generating fixed number of mines

- create a set
- until set reaches fixed number:
  - generate a random coorrdinate pair [x, y]
  - add pair to set

create a board matrix, iterate through cells:

- for each cell, look at all the neighbor coordinate pairs
- add # of coordinate pairs which appear in the set of mines

```
interface Board {
  cells: Cell[][];
}

interface Cell {
  adjacentMines: number;
  revealed: boolean;
}
```

## playing the game

game state

- revealedState matrix for each cell in initial board
