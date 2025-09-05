import { GridCell, Move, Solution } from '../types';

export class NumberMatchSolver {
  private grid: GridCell[][];
  
  constructor(grid: GridCell[][]) {
    this.grid = grid;
  }

  public solve(): Solution {
    const moves: Move[] = [];
    let currentGrid = this.deepCopyGrid(this.grid);
    let iterationCount = 0;
    const maxIterations = 1000; // Prevent infinite loops

    while (iterationCount < maxIterations) {
      const move = this.findNextMove(currentGrid);
      if (!move) break;

      moves.push(move);
      currentGrid = this.applyMove(currentGrid, move);
      iterationCount++;
      
      // Check if puzzle is completely solved (no numbers left)
      const hasNumbers = currentGrid.flat().some(cell => cell.value !== null);
      if (!hasNumbers) break;
    }

    return {
      moves,
      totalMoves: moves.length
    };
  }

  private findNextMove(grid: GridCell[][]): Move | null {
    const cells = this.getActiveCells(grid);
    
    for (let i = 0; i < cells.length; i++) {
      for (let j = i + 1; j < cells.length; j++) {
        const cell1 = cells[i];
        const cell2 = cells[j];
        
        if (this.canMatch(cell1, cell2) && this.areConnected(grid, cell1, cell2)) {
          return {
            from: cell1,
            to: cell2,
            type: cell1.value === cell2.value ? 'identical' : 'sum10'
          };
        }
      }
    }
    
    return null;
  }

  private canMatch(cell1: GridCell, cell2: GridCell): boolean {
    if (cell1.value === null || cell2.value === null) return false;
    
    // Identical match
    if (cell1.value === cell2.value) return true;
    
    // Sum to 10 match
    if (cell1.value + cell2.value === 10) return true;
    
    return false;
  }

  private areConnected(grid: GridCell[][], cell1: GridCell, cell2: GridCell): boolean {
    // Same row - check horizontal connection
    if (cell1.row === cell2.row) {
      return this.isHorizontallyConnected(grid, cell1, cell2);
    }
    
    // Same column - check vertical connection
    if (cell1.col === cell2.col) {
      return this.isVerticallyConnected(grid, cell1, cell2);
    }
    
    // Diagonal connection
    if (Math.abs(cell1.row - cell2.row) === Math.abs(cell1.col - cell2.col)) {
      return this.isDiagonallyConnected(grid, cell1, cell2);
    }
    
    // Cross-line connection (end of one line to beginning of adjacent line)
    if (Math.abs(cell1.row - cell2.row) === 1) {
      return this.isCrossLineConnected(grid, cell1, cell2);
    }
    
    return false;
  }

  private isHorizontallyConnected(grid: GridCell[][], cell1: GridCell, cell2: GridCell): boolean {
    const startCol = Math.min(cell1.col, cell2.col);
    const endCol = Math.max(cell1.col, cell2.col);
    
    for (let col = startCol + 1; col < endCol; col++) {
      if (grid[cell1.row][col].value !== null) {
        return false;
      }
    }
    return true;
  }

  private isVerticallyConnected(grid: GridCell[][], cell1: GridCell, cell2: GridCell): boolean {
    const startRow = Math.min(cell1.row, cell2.row);
    const endRow = Math.max(cell1.row, cell2.row);
    
    for (let row = startRow + 1; row < endRow; row++) {
      if (grid[row][cell1.col].value !== null) {
        return false;
      }
    }
    return true;
  }

  private isDiagonallyConnected(grid: GridCell[][], cell1: GridCell, cell2: GridCell): boolean {
    const rowStep = cell2.row > cell1.row ? 1 : -1;
    const colStep = cell2.col > cell1.col ? 1 : -1;
    
    let currentRow = cell1.row + rowStep;
    let currentCol = cell1.col + colStep;
    
    while (currentRow !== cell2.row && currentCol !== cell2.col) {
      if (grid[currentRow][currentCol].value !== null) {
        return false;
      }
      currentRow += rowStep;
      currentCol += colStep;
    }
    
    return true;
  }

  private isCrossLineConnected(grid: GridCell[][], cell1: GridCell, cell2: GridCell): boolean {
    // Check if one cell is at the end of its row and the other at the beginning of adjacent row
    const upperCell = cell1.row < cell2.row ? cell1 : cell2;
    const lowerCell = cell1.row < cell2.row ? cell2 : cell1;
    
    // Upper cell should be at the end of its row
    const isUpperAtEnd = this.isAtEndOfRow(grid, upperCell);
    // Lower cell should be at the beginning of its row
    const isLowerAtStart = this.isAtStartOfRow(grid, lowerCell);
    
    return isUpperAtEnd && isLowerAtStart;
  }

  private isAtEndOfRow(grid: GridCell[][], cell: GridCell): boolean {
    for (let col = cell.col + 1; col < grid[cell.row].length; col++) {
      if (grid[cell.row][col].value !== null) {
        return false;
      }
    }
    return true;
  }

  private isAtStartOfRow(grid: GridCell[][], cell: GridCell): boolean {
    for (let col = 0; col < cell.col; col++) {
      if (grid[cell.row][col].value !== null) {
        return false;
      }
    }
    return true;
  }

  private getActiveCells(grid: GridCell[][]): GridCell[] {
    return grid.flat().filter(cell => cell.value !== null);
  }

  private applyMove(grid: GridCell[][], move: Move): GridCell[][] {
    return grid.map(row =>
      row.map(cell => {
        if (cell.id === move.from.id || cell.id === move.to.id) {
          return { ...cell, value: null };
        }
        return cell;
      })
    );
  }

  private deepCopyGrid(grid: GridCell[][]): GridCell[][] {
    return grid.map(row => row.map(cell => ({ ...cell })));
  }
}