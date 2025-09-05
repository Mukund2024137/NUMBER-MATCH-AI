import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Calculator, Camera, Edit, Brain } from 'lucide-react';
import { GridEditor } from './components/GridEditor';
import { ScreenshotUpload } from './components/ScreenshotUpload';
import { SolutionDisplay } from './components/SolutionDisplay';
import { GridCell, Solution } from './types';
import { NumberMatchSolver } from './utils/solver';

function App() {
  const [activeTab, setActiveTab] = useState<'manual' | 'screenshot'>('manual');
  const [grid, setGrid] = useState<GridCell[][]>(() => {
    // Initialize with a sample puzzle
    const initialGrid = Array.from({ length: 8 }, (_, row) =>
      Array.from({ length: 10 }, (_, col) => ({
        value: null,
        row,
        col,
        id: `cell-${row}-${col}`
      }))
    );
    
    // Add some sample numbers
    const samplePattern = [
      [3, 7, 2, 8, 1, 9, 4, 6, 5, 5],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
      [null, null, 2, 8, null, null, 3, 7, null, null],
      [4, 6, null, null, 1, 9, null, null, 5, 5],
    ];
    
    samplePattern.forEach((row, rowIndex) => {
      if (rowIndex < initialGrid.length) {
        row.forEach((value, colIndex) => {
          if (colIndex < initialGrid[rowIndex].length) {
            initialGrid[rowIndex][colIndex].value = value;
          }
        });
      }
    });
    
    return initialGrid;
  });

  const [solution, setSolution] = useState<Solution | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const solvePuzzle = useCallback(() => {
    const solver = new NumberMatchSolver(grid);
    const newSolution = solver.solve();
    setSolution(newSolution);
    setCurrentStep(0);
  }, [grid]);

  // Auto-solve when grid changes
  useEffect(() => {
    const timer = setTimeout(() => {
      solvePuzzle();
    }, 500); // Debounce to avoid excessive solving

    return () => clearTimeout(timer);
  }, [solvePuzzle]);

  const highlightedCells = useMemo(() => {
    if (!solution || currentStep >= solution.moves.length) return [];
    
    const currentMove = solution.moves[currentStep];
    return [currentMove.from.id, currentMove.to.id];
  }, [solution, currentStep]);

  const handleGridChange = useCallback((newGrid: GridCell[][]) => {
    setGrid(newGrid);
  }, []);

  const handleGridDetected = useCallback((detectedGrid: GridCell[][]) => {
    setGrid(detectedGrid);
    setActiveTab('manual'); // Switch to manual tab to show the detected grid
  }, []);

  const handleStepChange = useCallback((step: number) => {
    setCurrentStep(step);
  }, []);

  const hasNumbers = grid.flat().some(cell => cell.value !== null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-xl shadow-lg">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Number Match Solver</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Input your Number Match puzzle manually or upload a screenshot, and get step-by-step solutions to clear the grid
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Panel - Input */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200">
                {/* Tab Navigation */}
                <div className="border-b border-gray-200">
                  <nav className="flex">
                    <button
                      onClick={() => setActiveTab('manual')}
                      className={`flex-1 py-4 px-6 text-center font-medium rounded-tl-2xl transition-colors ${
                        activeTab === 'manual'
                          ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Edit className="w-5 h-5 inline-block mr-2" />
                      Manual Input
                    </button>
                    <button
                      onClick={() => setActiveTab('screenshot')}
                      className={`flex-1 py-4 px-6 text-center font-medium rounded-tr-2xl transition-colors ${
                        activeTab === 'screenshot'
                          ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Camera className="w-5 h-5 inline-block mr-2" />
                      Screenshot Upload
                    </button>
                  </nav>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {activeTab === 'manual' ? (
                    <GridEditor
                      grid={grid}
                      onGridChange={handleGridChange}
                      highlightedCells={highlightedCells}
                    />
                  ) : (
                    <ScreenshotUpload onGridDetected={handleGridDetected} />
                  )}
                </div>
              </div>

              {/* Solve Button */}
              {hasNumbers && (
                <div className="text-center">
                  <button
                    onClick={solvePuzzle}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-3 mx-auto"
                  >
                    <Calculator className="w-6 h-6" />
                    Solve Puzzle
                  </button>
                </div>
              )}
            </div>

            {/* Right Panel - Solution */}
            <div className="space-y-6">
              <SolutionDisplay
                solution={solution}
                currentStep={currentStep}
                onStepChange={handleStepChange}
              />

              {/* Rules Panel */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Game Rules</h3>
                <div className="space-y-3 text-gray-700">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">1</div>
                    <p>Match identical numbers (e.g., 3-3) or pairs that sum to 10 (e.g., 2-8, 1-9, 4-6)</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">2</div>
                    <p>Numbers can be matched horizontally, vertically, or diagonally</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">3</div>
                    <p>Cross-line matching is allowed between end/beginning of adjacent rows</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">4</div>
                    <p>Clear all numbers from the grid to win the puzzle</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;