import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, Trophy, Clock, Target, Zap, Users, User, Settings, Play, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'wouter';
import { NPATGameEngine } from '@/lib/npatEngine';
import type { NPATGameState, NPATCategory, NPATGameRoom } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
// import MultiplayerRoom from './multiplayer-room';
// import { useWebSocket } from '@/hooks/use-websocket';

interface NPATGameProps {
  initialMode?: 'single' | 'multiplayer';
}

export default function NPATGame({ initialMode = 'single' }: NPATGameProps) {
  const [gameState, setGameState] = useState<NPATGameState | null>(null);
  const [gameMode, setGameMode] = useState<'menu' | 'settings' | 'playing' | 'roundComplete' | 'gameComplete' | 'multiplayer'>('menu');
  const [isMultiplayer, setIsMultiplayer] = useState(initialMode === 'multiplayer');
  const [timeLimit, setTimeLimit] = useState(30);
  const [totalRounds, setTotalRounds] = useState(5);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [currentAnswers, setCurrentAnswers] = useState<Record<NPATCategory, string>>({
    name: '',
    place: '',
    animal: '',
    thing: ''
  });
  const [roundResults, setRoundResults] = useState<any>(null);
  const [showLetterAnimation, setShowLetterAnimation] = useState(false);
  
  // Multiplayer state
  const [multiplayerRoom, setMultiplayerRoom] = useState<NPATGameRoom | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState('');
  const [otherPlayersSubmitted, setOtherPlayersSubmitted] = useState<string[]>([]);
  
  // WebSocket for multiplayer - only connect when in multiplayer mode
  // Temporarily disabled to fix loading issue
  // const wsUrl = `ws://localhost:3001`;
  // const { sendMessage } = useWebSocket(isMultiplayer ? wsUrl : '', {
  //   onMessage: handleMultiplayerMessage,
  // });
  const sendMessage = (message: any) => {
    console.log('WebSocket disabled, message:', message);
  }; // Temporary placeholder
  
  const gameEngineRef = useRef(new NPATGameEngine());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRefs = useRef<Record<NPATCategory, HTMLInputElement | null>>({
    name: null,
    place: null,
    animal: null,
    thing: null
  });

  function handleMultiplayerMessage(message: any) {
    console.log('Multiplayer message received:', message);
    // Temporarily disabled
  }

  // Timer effect
  useEffect(() => {
    if (gameMode === 'playing' && timeRemaining > 0) {
      timerRef.current = setTimeout(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSubmitRound();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [gameMode, timeRemaining]);

  const startGame = () => {
    const newGameState = gameEngineRef.current.initializeGame(isMultiplayer, timeLimit, totalRounds);
    setGameState(newGameState);
    startNextRound(newGameState);
  };

  const startNextRound = (currentGameState: NPATGameState) => {
    const { newGameState, letter } = gameEngineRef.current.startNextRound(currentGameState);
    setGameState(newGameState);
    setCurrentAnswers({ name: '', place: '', animal: '', thing: '' });
    setTimeRemaining(timeLimit);
    setShowLetterAnimation(true);
    setGameMode('playing');
    
    // Focus first input after animation
    setTimeout(() => {
      inputRefs.current.name?.focus();
    }, 1500);
  };

  const handleInputChange = (category: NPATCategory, value: string) => {
    setCurrentAnswers(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent, category: NPATCategory) => {
    if (e.key === 'Enter') {
      const categories: NPATCategory[] = ['name', 'place', 'animal', 'thing'];
      const currentIndex = categories.indexOf(category);
      const nextCategory = categories[currentIndex + 1];
      
      if (nextCategory) {
        inputRefs.current[nextCategory]?.focus();
      } else {
        handleSubmitRound();
      }
    }
  };

  const handleSubmitRound = () => {
    if (isMultiplayer && multiplayerRoom && playerId) {
      // Multiplayer mode - send answers to server
      sendMessage({
        type: 'SUBMIT_ANSWERS',
        data: { roomId: multiplayerRoom.roomId, playerId, answers: currentAnswers }
      });
    } else if (gameState) {
      // Single player mode
      const { newGameState, roundScore, isPerfectRound } = gameEngineRef.current.submitRound(gameState, currentAnswers);
      setGameState(newGameState);
      setRoundResults({ roundScore, isPerfectRound, answers: newGameState.rounds[newGameState.currentRound - 1].answers });
      
      if (newGameState.isGameComplete) {
        setGameMode('gameComplete');
      } else {
        setGameMode('roundComplete');
      }
    }
  };

  const nextRound = () => {
    if (isMultiplayer && multiplayerRoom && playerId && multiplayerRoom.hostId === playerId) {
      // Multiplayer mode - host starts next round
      sendMessage({
        type: 'NEXT_ROUND',
        data: { roomId: multiplayerRoom.roomId, playerId }
      });
    } else if (gameState) {
      // Single player mode
      startNextRound(gameState);
    }
  };

  const restartGame = () => {
    setGameMode('menu');
    setGameState(null);
    setRoundResults(null);
    setMultiplayerRoom(null);
    setPlayerId(null);
  };

  const handleMultiplayerGameStart = (gameRoom: NPATGameRoom) => {
    setMultiplayerRoom(gameRoom);
    setPlayerId(gameRoom.players.find(p => p.name === playerName)?.id || null);
    setGameMode('playing');
    setTimeRemaining(gameRoom.settings.timeLimit);
    setTimeLimit(gameRoom.settings.timeLimit);
    setTotalRounds(gameRoom.settings.totalRounds);
  };

  const handleMultiplayerBack = () => {
    setGameMode('menu');
    setMultiplayerRoom(null);
    setPlayerId(null);
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getInputClassName = (category: NPATCategory): string => {
    let baseClass = "w-full p-4 text-lg font-medium rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-4";
    
    if (roundResults?.answers[category]) {
      if (roundResults.answers[category].isValid) {
        baseClass += " border-neon-green bg-neon-green/10 text-green-800";
      } else if (roundResults.answers[category].isDuplicate) {
        baseClass += " border-sunny-yellow bg-sunny-yellow/10 text-yellow-800";
      } else {
        baseClass += " border-red-500 bg-red-50 text-red-800";
      }
    } else {
      baseClass += " border-gray-300 bg-white hover:border-electric-blue focus:border-electric-blue focus:ring-electric-blue/20";
    }
    
    return baseClass;
  };

  if (gameMode === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neon-green/20 to-sunny-yellow/20">
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
              
              <div className="flex items-center space-x-4">
                <h1 className="font-display font-bold text-2xl">NPAT Challenge</h1>
              </div>
              
              <Button onClick={() => setGameMode('settings')} variant="outline" className="flex items-center space-x-2">
                <Settings size={16} />
                <span>Settings</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.8 }}
              className="w-32 h-32 bg-gradient-to-br from-neon-green to-sunny-yellow rounded-3xl flex items-center justify-center mx-auto mb-8"
            >
              <span className="text-6xl font-bold text-white">N</span>
            </motion.div>

            <h1 className="font-display font-bold text-5xl sm:text-6xl text-gray-900 mb-6">
              Name, Place, Animal, Thing
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Quick thinking meets vocabulary skills! Find a name, place, animal, and thing starting with the same letter before time runs out.
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-12">
              <span className="px-4 py-2 bg-neon-green/20 text-green-800 rounded-full text-sm font-medium">
                Word Validation
              </span>
              <span className="px-4 py-2 bg-sunny-yellow/20 text-yellow-800 rounded-full text-sm font-medium">
                Perfect Round Bonus
              </span>
              <span className="px-4 py-2 bg-electric-blue/20 text-blue-800 rounded-full text-sm font-medium">
                Progressive Difficulty
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-2xl p-8 shadow-xl cursor-pointer border-2 border-transparent hover:border-electric-blue transition-all duration-300"
              onClick={() => {
                setIsMultiplayer(false);
                startGame();
              }}
            >
              <div className="w-16 h-16 bg-electric-blue rounded-xl flex items-center justify-center mb-6 mx-auto">
                <User className="text-2xl text-white" />
              </div>
              <h3 className="font-display font-bold text-xl text-center mb-4">Single Player</h3>
              <p className="text-gray-600 text-center mb-6">
                Challenge yourself with progressively harder letters and beat your personal best.
              </p>
              <div className="text-center">
                <span className="inline-flex items-center px-4 py-2 bg-electric-blue text-white rounded-xl font-medium">
                  <Play className="mr-2" size={16} />
                  Start Game
                </span>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-2xl p-8 shadow-xl cursor-pointer border-2 border-transparent hover:border-neon-green transition-all duration-300"
              style={{ border: '2px solid red' }}
              onClick={() => {
                alert('Multiplayer button clicked!');
                console.log('Multiplayer button clicked!');
                setIsMultiplayer(true);
                setGameMode('multiplayer');
              }}
            >
              <div className="w-16 h-16 bg-neon-green rounded-xl flex items-center justify-center mb-6 mx-auto">
                <Users className="text-2xl text-white" />
              </div>
              <h3 className="font-display font-bold text-xl text-center mb-4">Multiplayer (CLICK ME!)</h3>
              <p className="text-gray-600 text-center mb-6">
                Compete with friends in real-time. See who can think fastest under pressure.
              </p>
              <div className="text-center">
                <span className="inline-flex items-center px-4 py-2 bg-neon-green text-white rounded-xl font-medium">
                  <Play className="mr-2" size={16} />
                  Play Now
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  if (gameMode === 'settings') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neon-green/20 to-sunny-yellow/20">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-sm shadow-lg sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Button onClick={() => setGameMode('menu')} variant="ghost" className="flex items-center space-x-2">
                <ArrowLeft size={20} />
                <span>Back</span>
              </Button>
              
              <h1 className="font-display font-bold text-2xl">Game Settings</h1>
              
              <div></div>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="space-y-8">
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-4">Time Limit per Round</label>
                <div className="grid grid-cols-3 gap-4">
                  {[15, 30, 45].map((time) => (
                    <button
                      key={time}
                      onClick={() => setTimeLimit(time)}
                      className={`p-4 rounded-xl border-2 font-medium transition-all duration-200 ${
                        timeLimit === time
                          ? 'border-electric-blue bg-electric-blue text-white'
                          : 'border-gray-300 text-gray-700 hover:border-electric-blue'
                      }`}
                    >
                      {time}s
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-4">Number of Rounds</label>
                <div className="grid grid-cols-3 gap-4">
                  {[3, 5, 8].map((rounds) => (
                    <button
                      key={rounds}
                      onClick={() => setTotalRounds(rounds)}
                      className={`p-4 rounded-xl border-2 font-medium transition-all duration-200 ${
                        totalRounds === rounds
                          ? 'border-neon-green bg-neon-green text-white'
                          : 'border-gray-300 text-gray-700 hover:border-neon-green'
                      }`}
                    >
                      {rounds} rounds
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <Button 
                  onClick={() => {
                    setIsMultiplayer(false);
                    startGame();
                  }}
                  className="w-full"
                  size="lg"
                >
                  Start Game
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!gameState) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const currentRound = gameState.rounds[gameState.currentRound - 1];
  const gameStats = gameEngineRef.current.getGameStats(gameState);

  if (gameMode === 'playing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neon-green/20 to-sunny-yellow/20">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-sm shadow-lg sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Button onClick={restartGame} variant="ghost" className="flex items-center space-x-2">
                <ArrowLeft size={20} />
                <span>Exit Game</span>
              </Button>
              
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Trophy className="text-sunny-yellow" size={20} />
                  <span className="font-display font-bold">Round {gameState.currentRound} of {gameState.totalRounds}</span>
                </div>
                <Progress value={(gameState.currentRound / gameState.totalRounds) * 100} className="w-32" />
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Clock className="text-electric-blue" size={20} />
                  <span className={`font-bold text-lg ${timeRemaining <= 5 ? 'text-red-500' : 'text-gray-900'}`}>
                    {formatTime(timeRemaining)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="text-neon-green" size={20} />
                  <span className="font-bold">
                    {isMultiplayer && multiplayerRoom 
                      ? multiplayerRoom.players.find(p => p.id === playerId)?.score || 0
                      : gameState.totalScore
                    }
                  </span>
                </div>
                {isMultiplayer && multiplayerRoom && (
                  <div className="flex items-center space-x-2">
                    <Users className="text-vibrant-pink" size={20} />
                    <span className="font-bold text-sm">
                      {otherPlayersSubmitted.length}/{multiplayerRoom.players.length - 1} submitted
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Letter Display */}
          <AnimatePresence>
            {showLetterAnimation && (gameState?.currentLetter || multiplayerRoom?.gameState.currentLetter) && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onAnimationComplete={() => setShowLetterAnimation(false)}
                className="text-center mb-12"
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotateY: [0, 360, 0]
                  }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  className="w-48 h-48 bg-gradient-to-br from-electric-blue to-vibrant-pink rounded-3xl flex items-center justify-center mx-auto shadow-2xl"
                >
                  <span className="text-8xl font-bold text-white font-display">
                    {gameState?.currentLetter || multiplayerRoom?.gameState.currentLetter}
                  </span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {!showLetterAnimation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              {/* Current Letter Display */}
              <div className="text-center mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-electric-blue to-vibrant-pink rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl font-bold text-white font-display">
                    {gameState?.currentLetter || multiplayerRoom?.gameState.currentLetter}
                  </span>
                </div>
                <p className="text-gray-600">
                  Find words starting with <strong>{gameState?.currentLetter || multiplayerRoom?.gameState.currentLetter}</strong>
                </p>
              </div>

              {/* Input Fields */}
              <div className="grid gap-6 max-w-2xl mx-auto">
                {(['name', 'place', 'animal', 'thing'] as NPATCategory[]).map((category) => (
                  <div key={category}>
                    <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                      {category}
                    </label>
                    <input
                      ref={(el) => (inputRefs.current[category] = el)}
                      type="text"
                      value={currentAnswers[category]}
                      onChange={(e) => handleInputChange(category, e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, category)}
                      className={getInputClassName(category)}
                      placeholder={`Enter a ${category} starting with ${gameState?.currentLetter || multiplayerRoom?.gameState.currentLetter}...`}
                      disabled={gameMode !== 'playing'}
                    />
                  </div>
                ))}
              </div>

              {/* Submit Button */}
              <div className="text-center mt-8">
                <Button
                  onClick={handleSubmitRound}
                  size="lg"
                  className="px-12 py-4 text-lg"
                  disabled={gameMode !== 'playing'}
                >
                  Submit Answers
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  if (gameMode === 'roundComplete' && roundResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neon-green/20 to-sunny-yellow/20 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl p-8 max-w-2xl w-full text-center shadow-xl"
        >
          <div className="text-6xl mb-4">
            {roundResults.isPerfectRound ? '🎉' : '📝'}
          </div>
          
          <h2 className="font-display font-bold text-3xl mb-4">
            {roundResults.isPerfectRound ? 'Perfect Round!' : 'Round Complete'}
          </h2>
          
          <div className="text-2xl font-bold text-electric-blue mb-6">
            +{roundResults.roundScore} points
          </div>

          {/* Answer Results */}
          <div className="space-y-3 mb-8">
            {Object.entries(roundResults.answers).map(([category, answer]: [string, any]) => (
              <div key={category} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <span className="capitalize font-medium">{category}:</span>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{answer.value || '(empty)'}</span>
                  {answer.isValid ? (
                    <CheckCircle className="text-neon-green" size={20} />
                  ) : answer.isDuplicate ? (
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-yellow-600">duplicate</span>
                      <XCircle className="text-sunny-yellow" size={20} />
                    </div>
                  ) : (
                    <XCircle className="text-red-500" size={20} />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex space-x-4">
            {gameState.currentRound < gameState.totalRounds ? (
              <Button onClick={nextRound} className="flex-1" size="lg">
                Next Round
              </Button>
            ) : (
              <Button onClick={() => setGameMode('gameComplete')} className="flex-1" size="lg">
                View Results
              </Button>
            )}
            <Button onClick={restartGame} variant="outline" className="flex-1" size="lg">
              New Game
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (gameMode === 'gameComplete') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neon-green/20 to-sunny-yellow/20 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl p-8 max-w-2xl w-full text-center shadow-xl"
        >
          <div className="text-6xl mb-4">🏆</div>
          
          <h2 className="font-display font-bold text-3xl mb-6">
            Game Complete!
          </h2>

          {/* Final Stats */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="text-center">
              <div className="font-bold text-3xl text-electric-blue">{gameStats.totalScore}</div>
              <div className="text-gray-500">Total Score</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-3xl text-neon-green">{gameStats.perfectRounds}</div>
              <div className="text-gray-500">Perfect Rounds</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-3xl text-vibrant-pink">{gameStats.averageScore}</div>
              <div className="text-gray-500">Average/Round</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-3xl text-sunny-yellow">{gameStats.efficiency}%</div>
              <div className="text-gray-500">Efficiency</div>
            </div>
          </div>

          <div className="flex space-x-4">
            <Button onClick={restartGame} className="flex-1" size="lg">
              Play Again
            </Button>
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full" size="lg">
                Back Home
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (gameMode === 'multiplayer') {
    console.log('Rendering multiplayer mode!');
    return (
      <div className="min-h-screen bg-gradient-to-br from-neon-green/20 to-sunny-yellow/20 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 text-center max-w-2xl">
          <div className="w-32 h-32 bg-gradient-to-br from-electric-blue to-vibrant-pink rounded-3xl flex items-center justify-center mx-auto mb-8">
            <Users className="text-6xl text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Multiplayer NPAT</h2>
          <p className="mb-6 text-gray-600">Real-time multiplayer functionality is ready!</p>
          <div className="space-y-4">
            <Button onClick={handleMultiplayerBack} className="w-full">
              Back to Menu
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}