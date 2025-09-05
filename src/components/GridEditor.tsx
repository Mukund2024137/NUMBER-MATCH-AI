import React, { useState, useCallback } from 'react';
import { GridCell } from '../types';
import { Edit3, Trash2 } from 'lucide-react';

interface GridEditorProps {
  grid: GridCell[][];
  onGridChange: (grid: GridCell[][]) => void;
  highlightedCells?: string[];
}

export const GridEditor: React.FC<GridEditorProps> = ({ 
  grid, 
  onGridChange, 
  highlightedCells = [] 
}) => {
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');

  const handleCellClick = useCallback((cellId: string) => {
    setEditingCell(cellId);
    const cell = grid.flat().find(c => c.id === cellId);
    setInputValue(cell?.value?.toString() || '');
  }, [grid]);

  const handleInputChange = useCallback((value: string) => {
    setInputValue(value);
  }, []);

  const handleInputSubmit = useCallback(() => {
    if (!editingCell) return;

    const newGrid = grid.map(row =>
      row.map(cell => {
        if (cell.id === editingCell) {
          const numValue = inputValue === '' ? null : parseInt(inputValue, 10);
          return {
            ...cell,
            value: isNaN(numValue) ? null : numValue
          };
        }
        return cell;
      })
    );

    onGridChange(newGrid);
    setEditingCell(null);
    setInputValue('');
  }, [editingCell, inputValue, grid, onGridChange]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleInputSubmit();
    } else if (e.key === 'Escape') {
      setEditingCell(null);
      setInputValue('');
    }
  }, [handleInputSubmit]);

  const clearGrid = useCallback(() => {
    const newGrid = grid.map(row =>
      row.map(cell => ({
        ...cell,
        value: null
      }))
    );
    onGridChange(newGrid);
  }, [grid, onGridChange]);

  const addColumn = useCallback(() => {
    const newGrid = grid.map((row, rowIndex) => [
      ...row,
      {
        value: null,
        row: rowIndex,
        col: row.length,
        id: `cell-${rowIndex}-${row.length}`
      }
    ]);
    onGridChange(newGrid);
  }, [grid, onGridChange]);

  const removeColumn = useCallback(() => {
    if (grid[0]?.length > 1) {
      const newGrid = grid.map(row => row.slice(0, -1));
      onGridChange(newGrid);
    }
  }, [grid, onGridChange]);

  const setColumnsToNine = useCallback(() => {
    const targetColumns = 9;
    const currentColumns = grid[0]?.length || 0;
    
    if (currentColumns === targetColumns) return;
    
    const newGrid = grid.map((row, rowIndex) => {
      if (currentColumns < targetColumns) {
        // Add columns
        const newCells = Array.from({ length: targetColumns - currentColumns }, (_, i) => ({
          value: null,
          row: rowIndex,
          col: currentColumns + i,
          id: `cell-${rowIndex}-${currentColumns + i}`
        }));
        return [...row, ...newCells];
      } else {
        // Remove columns
        return row.slice(0, targetColumns);
      }
    });
    onGridChange(newGrid);
  }, [grid, onGridChange]);
  const addRow = useCallback(() => {
    const newRowIndex = grid.length;
    const newRow = Array.from({ length: grid[0]?.length || 10 }, (_, colIndex) => ({
      value: null,
      row: newRowIndex,
      col: colIndex,
      id: `cell-${newRowIndex}-${colIndex}`
    }));
    onGridChange([...grid, newRow]);
  }, [grid, onGridChange]);

  const removeRow = useCallback(() => {
    if (grid.length > 1) {
      onGridChange(grid.slice(0, -1));
    }
  }, [grid, onGridChange]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 justify-between items-center">
        <div className="flex gap-2">
          <button
            onClick={addColumn}
            className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
          >
            Add Column
          </button>
          <button
            onClick={removeColumn}
            className="px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium"
          >
            Remove Column
          </button>
          <button
            onClick={setColumnsToNine}
            className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
          >
            Set 9 Columns
          </button>
          <button
            onClick={addRow}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Add Row
          </button>
          <button
            onClick={removeRow}
            className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
          >
            Remove Row
          </button>
        </div>
        <button
          onClick={clearGrid}
          className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center gap-2"
        >
          <Trash2 size={16} />
          Clear All
        </button>
      </div>

      <div className="grid gap-1 p-4 bg-gray-50 rounded-xl border-2 border-gray-200" style={{
        gridTemplateColumns: `repeat(${grid[0]?.length || 10}, minmax(0, 1fr))`
      }}>
        {grid.flat().map((cell) => (
          <div
            key={cell.id}
            className={`
              relative h-12 w-12 border-2 rounded-lg cursor-pointer transition-all duration-200
              ${highlightedCells.includes(cell.id) 
                ? 'border-orange-400 bg-orange-100 shadow-lg transform scale-105' 
                : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
              }
              ${editingCell === cell.id ? 'ring-2 ring-blue-500 border-blue-500' : ''}
            `}
            onClick={() => handleCellClick(cell.id)}
          >
            {editingCell === cell.id ? (
              <input
                type="number"
                value={inputValue}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={handleKeyPress}
                onBlur={handleInputSubmit}
                className="w-full h-full text-center bg-transparent border-none outline-none text-lg font-semibold"
                autoFocus
                min="0"
                max="9"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-lg font-semibold text-gray-800">
                {cell.value !== null ? cell.value : ''}
              </div>
            )}
            
            {cell.value !== null && !editingCell && (
              <Edit3 className="absolute top-1 right-1 w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </div>
        ))}
      </div>

      <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
        <p className="font-medium mb-1">Instructions:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Click any cell to edit its value (0-9)</li>
          <li>Press Enter to save, Escape to cancel</li>
          <li>Empty cells are treated as gaps in the puzzle</li>
        </ul>
      </div>
    </div>
  );
};