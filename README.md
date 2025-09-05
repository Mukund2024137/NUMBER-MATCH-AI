# Number Match Puzzle Solver

A sophisticated web application that helps solve Number Match puzzles by providing step-by-step solutions. Users can input puzzles manually or upload screenshots for automatic number detection.

## Features

- **Manual Grid Editor**: Interactive grid with add/remove rows and columns
- **Screenshot OCR**: Upload puzzle images for automatic number extraction
- **Smart Solver**: Advanced algorithm that finds optimal move sequences
- **Visual Solution**: Step-by-step move visualization with playback controls
- **Responsive Design**: Works perfectly on desktop and mobile devices

## Game Rules

1. Match identical numbers (e.g., 3-3) or pairs that sum to 10 (e.g., 2-8, 1-9, 4-6)
2. Numbers can be matched horizontally, vertically, or diagonally
3. Cross-line matching is allowed between end/beginning of adjacent rows
4. Clear all numbers from the grid to win the puzzle

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/number-match-solver.git
cd number-match-solver
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

### Manual Input
1. Click on the "Manual Input" tab
2. Use the grid editor to input your puzzle numbers
3. Add/remove rows and columns as needed
4. Click "Solve Puzzle" to get the solution

### Screenshot Upload
1. Click on the "Screenshot Upload" tab
2. Upload a clear image of your puzzle
3. Wait for OCR processing to extract numbers
4. Review and edit the detected grid if needed
5. Get your step-by-step solution

## Technologies Used

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server
- **Tesseract.js** - OCR for screenshot processing
- **Lucide React** - Beautiful icons

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Deployment

This project is configured for easy deployment on GitHub Pages, Netlify, or Vercel. See the deployment workflows in `.github/workflows/` for automated deployment setup.