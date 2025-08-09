import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, Trophy, Clock, Target, Zap } from 'lucide-react';
import { Link } from 'wouter';
import { WordFinderEngine, LEVEL_CONFIGURATIONS } from '@/lib/wordFinderEngine';
import type { GameState, GridCell } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
// import confetti from 'canvas-confetti';

interface WordFinderGameProps {
  initialLevel?: number;
}

export default function WordFinderGame({ initialLevel = 1 }: WordFinderGameProps) {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [selectedCells, setSelectedCells] = useState<{ row: number; col: number }[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [showGameComplete, setShowGameComplete] = useState(false);
  const [lastFoundWord, setLastFoundWord] = useState<string>('');
  const [attempts, setAttempts] = useState(0);
  const [incorrectAttempts, setIncorrectAttempts] = useState(0);
  
  const gameEngineRef = useRef(new WordFinderEngine());
  const gridRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Initialize game
  useEffect(() => {
    const newGameState = gameEngineRef.current.initializeGame(initialLevel);
    setGameState(newGameState);
    setTimeElapsed(0);
    setAttempts(0);
    setIncorrectAttempts(0);
  }, [initialLevel]);

  // Timer effect
  useEffect(() => {
    if (gameState && !gameState.levelComplete) {
      timerRef.current = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState?.levelComplete]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleCellMouseDown = (row: number, col: number) => {
    setIsSelecting(true);
    setSelectedCells([{ row, col }]);
  };

  const handleCellMouseEnter = (row: number, col: number) => {
    if (isSelecting) {
      setSelectedCells(prev => {
        const newSelection = [...prev];
        const lastCell = newSelection[newSelection.length - 1];
        
        // Check if we're creating a straight line
        if (newSelection.length === 1) {
          newSelection.push({ row, col });
        } else {
          // Calculate if this continues the same line
          const firstCell = newSelection[0];
          const isValidLine = isInLine(firstCell, lastCell, { row, col });
          
          if (isValidLine) {
            // Add to line or replace if going backwards
            const cellIndex = newSelection.findIndex(c => c.row === row && c.col === col);
            if (cellIndex !== -1) {
              // Going backwards, truncate selection
              newSelection.splice(cellIndex + 1);
            } else {
              newSelection.push({ row, col });
            }
          }
        }
        
        return newSelection;
      });
    }
  };

  const handleMouseUp = () => {
    if (isSelecting && selectedCells.length > 1) {
      checkSelection();
    }
    setIsSelecting(false);
    setSelectedCells([]);
  };

  const isInLine = (start: { row: number; col: number }, middle: { row: number; col: number }, end: { row: number; col: number }): boolean => {
    const dx1 = middle.col - start.col;
    const dy1 = middle.row - start.row;
    const dx2 = end.col - start.col;
    const dy2 = end.row - start.row;

    // Check if they're in the same direction
    const cross = dx1 * dy2 - dy1 * dx2;
    return cross === 0;
  };

  const checkSelection = () => {
    if (!gameState) return;
    
    setAttempts(prev => prev + 1);
    
    const result = gameEngineRef.current.checkWordSelection(gameState, selectedCells);
    
    if (result.wordFound) {
      setLastFoundWord(result.wordFound);
      setGameState(result.newGameState);
      
      // Trigger confetti animation - placeholder for now
      console.log('Word found:', result.wordFound);
      
      if (result.isLevelComplete) {
        setShowLevelComplete(true);
        if (result.newGameState.isComplete) {
          setShowGameComplete(true);
        }
      }
    } else {
      setIncorrectAttempts(prev => prev + 1);
      // Brief red flash effect could be added here
    }
  };

  const restartLevel = () => {
    if (!gameState) return;
    const newGameState = gameEngineRef.current.initializeGame(gameState.currentLevel);
    setGameState(newGameState);
    setTimeElapsed(0);
    setAttempts(0);
    setIncorrectAttempts(0);
    setShowLevelComplete(false);
    setLastFoundWord('');
  };

  const nextLevel = () => {
    if (!gameState) return;
    const newGameState = gameEngineRef.current.initializeGame(gameState.currentLevel + 1);
    setGameState(newGameState);
    setTimeElapsed(0);
    setAttempts(0);
    setIncorrectAttempts(0);
    setShowLevelComplete(false);
    setLastFoundWord('');
  };

  const getCellClassName = (cell: GridCell, row: number, col: number): string => {
    let className = "w-8 h-8 flex items-center justify-center text-sm font-bold rounded-lg border-2 transition-all duration-200 cursor-pointer select-none";
    
    if (cell.isFound) {
      className += " bg-neon-green text-white border-neon-green";
    } else if (selectedCells.some(sc => sc.row === row && sc.col === col)) {
      className += " bg-electric-blue text-white border-electric-blue";
    } else {
      className += " bg-white text-gray-800 border-gray-200 hover:border-electric-blue hover:bg-electric-blue/10";
    }
    
    return className;
  };

  if (!gameState) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const accuracy = attempts > 0 ? Math.round(((attempts - incorrectAttempts) / attempts) * 100) : 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-electric-blue/20 to-vibrant-pink/20">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" className="flex items-center space-x-2">
                <ArrowLeft size={20} />
                <span>Back to GameHub</span>
              </Button>
            </Link>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Trophy className="text-sunny-yellow" size={20} />
                <span className="font-display font-bold">Level {gameState.currentLevel} of {LEVEL_CONFIGURATIONS.length}</span>
              </div>
              <Progress value={(gameState.currentLevel / LEVEL_CONFIGURATIONS.length) * 100} className="w-32" />
            </div>
            
            <Button onClick={restartLevel} variant="outline" className="flex items-center space-x-2">
              <RotateCcw size={16} />
              <span>Restart</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Game Grid */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div 
                ref={gridRef}
                className="grid grid-cols-12 gap-2 mx-auto max-w-lg"
                onMouseUp={handleMouseUp}
                onMouseLeave={() => {
                  setIsSelecting(false);
                  setSelectedCells([]);
                }}
              >
                {gameState.grid.map((row, rowIndex) =>
                  row.map((cell, colIndex) => (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={getCellClassName(cell, rowIndex, colIndex)}
                      onMouseDown={() => handleCellMouseDown(rowIndex, colIndex)}
                      onMouseEnter={() => handleCellMouseEnter(rowIndex, colIndex)}
                    >
                      {cell.letter}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="font-display font-bold text-lg mb-4">Game Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="text-electric-blue" size={16} />
                    <span>Time</span>
                  </div>
                  <span className="font-bold">{formatTime(timeElapsed)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Target className="text-neon-green" size={16} />
                    <span>Found</span>
                  </div>
                  <span className="font-bold">{gameState.wordsFound} / {gameState.totalWords}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Zap className="text-vibrant-pink" size={16} />
                    <span>Accuracy</span>
                  </div>
                  <span className="font-bold">{accuracy}%</span>
                </div>
              </div>
            </div>

            {/* Words List */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="font-display font-bold text-lg mb-4">Find These Words</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {gameState.words.map((word, index) => (
                  <div
                    key={word.id}
                    className={`p-2 rounded-lg flex items-center justify-between transition-all duration-300 ${
                      word.isFound 
                        ? 'bg-neon-green/20 text-green-800 line-through' 
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <span className="font-medium">{word.word}</span>
                    {word.isFound && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-5 h-5 bg-neon-green rounded-full flex items-center justify-center"
                      >
                        <span className="text-white text-xs">✓</span>
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Level Complete Modal */}
      <AnimatePresence>
        {showLevelComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full text-center"
            >
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="font-display font-bold text-2xl mb-4">
                {showGameComplete ? 'Congratulations!' : 'Level Complete!'}
              </h2>
              <p className="text-gray-600 mb-6">
                {showGameComplete 
                  ? 'You completed all challenges!' 
                  : `You found all words in ${formatTime(timeElapsed)}!`
                }
              </p>
              
              <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
                <div className="text-center">
                  <div className="font-bold text-lg">{formatTime(timeElapsed)}</div>
                  <div className="text-gray-500">Time</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg">{accuracy}%</div>
                  <div className="text-gray-500">Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg">{gameState.wordsFound}</div>
                  <div className="text-gray-500">Words</div>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <Button onClick={restartLevel} variant="outline" className="flex-1">
                  Replay Level
                </Button>
                {!showGameComplete && gameState.currentLevel < LEVEL_CONFIGURATIONS.length && (
                  <Button onClick={nextLevel} className="flex-1">
                    Next Level
                  </Button>
                )}
                {showGameComplete && (
                  <Link href="/" className="flex-1">
                    <Button className="w-full">
                      Back Home
                    </Button>
                  </Link>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}