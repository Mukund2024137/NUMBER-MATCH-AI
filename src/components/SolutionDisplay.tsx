import React, { useState, useCallback } from 'react';
import { Solution, Move } from '../types';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Trophy } from 'lucide-react';

interface SolutionDisplayProps {
  solution: Solution | null;
  currentStep: number;
  onStepChange: (step: number) => void;
}

export const SolutionDisplay: React.FC<SolutionDisplayProps> = ({
  solution,
  currentStep,
  onStepChange
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = useCallback(() => {
    if (!solution || currentStep >= solution.moves.length) return;
    
    setIsPlaying(true);
    const interval = setInterval(() => {
      onStepChange((prev) => {
        const next = prev + 1;
        if (next >= solution.moves.length) {
          setIsPlaying(false);
          clearInterval(interval);
          return prev;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [solution, currentStep, onStepChange]);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const handleReset = useCallback(() => {
    setIsPlaying(false);
    onStepChange(0);
  }, [onStepChange]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      onStepChange(currentStep - 1);
    }
  }, [currentStep, onStepChange]);

  const handleNext = useCallback(() => {
    if (solution && currentStep < solution.moves.length - 1) {
      onStepChange(currentStep + 1);
    }
  }, [solution, currentStep, onStepChange]);

  if (!solution) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
        <div className="text-gray-500">
          <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold mb-2">No Solution Yet</h3>
          <p>Enter your puzzle grid above to see the winning moves!</p>
        </div>
      </div>
    );
  }

  if (solution.moves.length === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
        <div className="text-green-700">
          <Trophy className="w-16 h-16 mx-auto mb-4 text-green-600" />
          <h3 className="text-lg font-semibold mb-2">Puzzle Already Solved!</h3>
          <p>This grid has no numbers to match. Great job!</p>
        </div>
      </div>
    );
  }

  const currentMove = solution.moves[currentStep];
  const isComplete = currentStep >= solution.moves.length;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Solution Steps</h3>
        <div className="text-sm text-gray-600">
          {isComplete ? 'Complete!' : `Step ${currentStep + 1} of ${solution.moves.length}`}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm text-gray-600">
            {Math.round(((currentStep + 1) / solution.moves.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / solution.moves.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Current Move Display */}
      {!isComplete && currentMove && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-blue-900 mb-2">Current Move:</h4>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="w-10 h-10 bg-white border-2 border-blue-300 rounded-lg flex items-center justify-center font-bold text-blue-800">
                {currentMove.from.value}
              </div>
              <div className="text-xs text-blue-600 mt-1">
                ({currentMove.from.row + 1}, {currentMove.from.col + 1})
              </div>
            </div>
            
            <div className="flex-1 text-center">
              <div className="text-sm font-medium text-blue-700">
                {currentMove.type === 'identical' ? 'Match Identical' : 'Sum to 10'}
              </div>
              <div className="text-lg font-bold text-blue-600">→</div>
            </div>
            
            <div className="text-center">
              <div className="w-10 h-10 bg-white border-2 border-blue-300 rounded-lg flex items-center justify-center font-bold text-blue-800">
                {currentMove.to.value}
              </div>
              <div className="text-xs text-blue-600 mt-1">
                ({currentMove.to.row + 1}, {currentMove.to.col + 1})
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Completion Message */}
      {isComplete && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-green-600" />
            <div>
              <h4 className="font-semibold text-green-900">Puzzle Solved!</h4>
              <p className="text-green-700">All numbers cleared in {solution.moves.length} moves.</p>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium flex items-center gap-2"
          disabled={currentStep === 0}
        >
          <RotateCcw size={16} />
          Reset
        </button>
        
        <button
          onClick={handlePrevious}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={currentStep === 0}
        >
          <ChevronLeft size={16} />
          Previous
        </button>

        {!isPlaying ? (
          <button
            onClick={handlePlay}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isComplete}
          >
            <Play size={16} />
            Play
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium flex items-center gap-2"
          >
            <Pause size={16} />
            Pause
          </button>
        )}

        <button
          onClick={handleNext}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isComplete}
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};