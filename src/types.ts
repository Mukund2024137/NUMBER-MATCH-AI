export interface GridCell {
  value: number | null;
  row: number;
  col: number;
  id: string;
}

export interface Move {
  from: GridCell;
  to: GridCell;
  type: 'identical' | 'sum10';
}

export interface Solution {
  moves: Move[];
  totalMoves: number;
}