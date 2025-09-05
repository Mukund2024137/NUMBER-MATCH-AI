import React, { useState, useCallback } from 'react';
import { Camera, Upload, Loader2, AlertCircle } from 'lucide-react';
import { GridCell } from '../types';
import Tesseract from 'tesseract.js';

interface ScreenshotUploadProps {
  onGridDetected: (grid: GridCell[][]) => void;
}

export const ScreenshotUpload: React.FC<ScreenshotUploadProps> = ({ onGridDetected }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [ocrProgress, setOcrProgress] = useState(0);

  const extractNumbersFromText = (text: string): number[][] => {
    // Split text into lines and extract numbers
    const lines = text.split('\n').filter(line => line.trim());
    const numberGrid: number[][] = [];
    
    for (const line of lines) {
      // Extract all digits from the line, including spaced digits
      const numbers = line.match(/\d/g);
      if (numbers && numbers.length > 0) {
        numberGrid.push(numbers.map(n => parseInt(n, 10)));
      }
    }
    
    return numberGrid;
  };

  const createGridFromNumbers = (numberGrid: number[][]): GridCell[][] => {
    const maxCols = Math.max(...numberGrid.map(row => row.length), 9);
    const rows = Math.max(numberGrid.length, 8);
    
    return Array.from({ length: rows }, (_, row) =>
      Array.from({ length: maxCols }, (_, col) => ({
        value: numberGrid[row]?.[col] ?? null,
        row,
        col,
        id: `cell-${row}-${col}`
      }))
    );
  };
  const processImage = useCallback(async (file: File) => {
    setIsProcessing(true);
    setError(null);
    setOcrProgress(0);
    
    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Process image with Tesseract.js
      const { data: { text } } = await Tesseract.recognize(file, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setOcrProgress(Math.round(m.progress * 100));
          }
        }
      });
      
      console.log('OCR Result:', text);
      
      // Extract numbers from OCR text
      const numberGrid = extractNumbersFromText(text);
      
      if (numberGrid.length === 0) {
        throw new Error('No numbers detected in the image. Please ensure the image is clear and contains visible numbers.');
      }
      
      // Convert to GridCell format
      const detectedGrid = createGridFromNumbers(numberGrid);
      
      console.log('Detected Grid:', detectedGrid);
      

      onGridDetected(detectedGrid);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process image. Please try again.';
      setError(errorMessage);
      console.error('Image processing error:', err);
    } finally {
      setIsProcessing(false);
      setOcrProgress(0);
    }
  }, [onGridDetected]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        processImage(file);
      } else {
        setError('Please select a valid image file.');
      }
    }
  }, [processImage]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      processImage(file);
    } else {
      setError('Please drop a valid image file.');
    }
  }, [processImage]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  return (
    <div className="space-y-6">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
        id="screenshot-upload"
        disabled={isProcessing}
      />
      
      <div
        className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => document.getElementById('screenshot-upload')?.click()}
      >
        <div className="flex flex-col items-center space-y-4">
          {isProcessing ? (
            <>
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
              {ocrProgress > 0 && (
                <div className="w-full max-w-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Processing...</span>
                    <span className="text-sm text-gray-600">{ocrProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${ocrProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </>
          ) : (
            <Camera className="w-12 h-12 text-gray-400" />
          )}
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {isProcessing ? 'Processing Image...' : 'Upload Screenshot'}
            </h3>
            <p className="text-gray-600 mt-1">
              {isProcessing 
                ? 'Extracting numbers from your image' 
                : 'Drag and drop or click to select an image of your puzzle'
              }
            </p>
          </div>
          
          {!isProcessing && (
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2">
              <Upload size={20} />
              Choose File
            </button>
          )}
        </div>
      </div>

      {previewImage && (
        <div className="bg-gray-50 rounded-xl p-4">
          <h4 className="font-medium text-gray-900 mb-3">Uploaded Image:</h4>
          <img 
            src={previewImage} 
            alt="Uploaded puzzle" 
            className="max-w-full h-auto rounded-lg border border-gray-300 mx-auto"
            style={{ maxHeight: '300px' }}
          />
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-red-800 font-medium">Error:</p>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-2">Tips for Best Results:</h4>
        <ul className="text-blue-700 text-sm space-y-1 list-disc list-inside">
          <li>Ensure good lighting and clear image quality</li>
          <li>Crop the image to focus on just the puzzle grid</li>
          <li>Make sure numbers are clearly visible and not blurred</li>
          <li>Avoid shadows or reflections over the numbers</li>
          <li>Use high contrast images (dark numbers on light background)</li>
          <li>Ensure numbers are properly aligned in rows and columns</li>
        </ul>
      </div>
    </div>
  );
};