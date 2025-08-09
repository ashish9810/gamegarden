import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Users, Copy, Check, Crown, User, Play, Settings } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { useWebSocket } from '@/hooks/use-websocket';
import type { NPATGameRoom, NPATPlayer } from '@shared/schema';

interface MultiplayerRoomProps {
  onGameStart: (gameRoom: NPATGameRoom) => void;
  onBack: () => void;
}

export default function MultiplayerRoom({ onGameStart, onBack }: MultiplayerRoomProps) {
  console.log('MultiplayerRoom component rendered!');
  const [mode, setMode] = useState<'menu' | 'create' | 'join' | 'lobby'>('menu');
  const [playerName, setPlayerName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [timeLimit, setTimeLimit] = useState(30);
  const [totalRounds, setTotalRounds] = useState(5);
  const [gameRoom, setGameRoom] = useState<NPATGameRoom | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // WebSocket connection - only connect when needed
  const wsUrl = `ws://localhost:3001`;
  const { isConnected, sendMessage } = useWebSocket(mode !== 'menu' ? wsUrl : '', {
    onMessage: handleWebSocketMessage,
    onError: () => setError('Connection failed. Please try again.'),
  });

  function handleWebSocketMessage(message: any) {
    console.log('Received WebSocket message:', message);
    switch (message.type) {
      case 'ROOM_CREATED':
        setGameRoom(message.data.gameRoom);
        setPlayerId(message.data.playerId);
        setMode('lobby');
        setError(null);
        break;
      case 'PLAYER_JOINED':
        setGameRoom(message.data.gameRoom);
        setMode('lobby');
        setError(null);
        break;
      case 'PLAYER_LEFT':
        setGameRoom(message.data.gameRoom);
        break;
      case 'PLAYER_READY_UPDATE':
        setGameRoom(message.data.gameRoom);
        break;
      case 'GAME_STARTED':
        setGameRoom(message.data.gameRoom);
        onGameStart(message.data.gameRoom);
        break;
      case 'ERROR':
        setError(message.data.message);
        break;
    }
  }

  const createRoom = () => {
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }
    
    sendMessage({
      type: 'CREATE_ROOM',
      data: { playerName: playerName.trim(), timeLimit, totalRounds }
    });
  };

  const joinRoom = () => {
    if (!playerName.trim() || !roomId.trim()) {
      setError('Please enter your name and room ID');
      return;
    }
    
    sendMessage({
      type: 'JOIN_ROOM',
      data: { roomId: roomId.trim().toUpperCase(), playerName: playerName.trim() }
    });
  };

  const toggleReady = () => {
    if (!gameRoom || !playerId) return;
    
    const player = gameRoom.players.find(p => p.id === playerId);
    if (!player) return;
    
    sendMessage({
      type: 'PLAYER_READY',
      data: { roomId: gameRoom.roomId, playerId, isReady: !player.isReady }
    });
  };

  const startGame = () => {
    if (!gameRoom || !playerId || gameRoom.hostId !== playerId) return;
    
    sendMessage({
      type: 'START_GAME',
      data: { roomId: gameRoom.roomId, playerId }
    });
  };

  const copyRoomId = async () => {
    if (gameRoom) {
      await navigator.clipboard.writeText(gameRoom.roomId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isHost = gameRoom && playerId && gameRoom.hostId === playerId;
  const allReady = gameRoom && gameRoom.players.every(p => p.isReady);
  const currentPlayer = gameRoom?.players.find(p => p.id === playerId);

  if (mode === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neon-green/20 to-sunny-yellow/20">
        <div className="bg-white/95 backdrop-blur-sm shadow-lg sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Button onClick={onBack} variant="ghost" className="flex items-center space-x-2">
                <ArrowLeft size={20} />
                <span>Back</span>
              </Button>
              <h1 className="font-display font-bold text-2xl">Multiplayer NPAT</h1>
              <div className="w-20"></div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.8 }}
              className="w-32 h-32 bg-gradient-to-br from-electric-blue to-vibrant-pink rounded-3xl flex items-center justify-center mx-auto mb-8"
            >
              <Users className="text-6xl text-white" />
            </motion.div>

            <h1 className="font-display font-bold text-5xl sm:text-6xl text-gray-900 mb-6">
              Play with Friends
            </h1>

            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Create a room and invite friends, or join an existing game. Challenge each other in real-time!
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.button
                onClick={() => setMode('create')}
                className="px-8 py-4 bg-gradient-to-r from-electric-blue to-vibrant-pink text-white font-display font-bold text-lg rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Create Room
              </motion.button>

              <motion.button
                onClick={() => setMode('join')}
                className="px-8 py-4 bg-white border-2 border-electric-blue text-electric-blue font-display font-bold text-lg rounded-2xl hover:bg-electric-blue hover:text-white transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Join Room
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'create') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neon-green/20 to-sunny-yellow/20">
        <div className="bg-white/95 backdrop-blur-sm shadow-lg sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Button onClick={() => setMode('menu')} variant="ghost" className="flex items-center space-x-2">
                <ArrowLeft size={20} />
                <span>Back</span>
              </Button>
              <h1 className="font-display font-bold text-2xl">Create Room</h1>
              <div className="w-20"></div>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <h2 className="font-display font-bold text-3xl text-center mb-8">Room Settings</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full p-4 text-lg border-2 border-gray-300 rounded-xl focus:border-electric-blue focus:outline-none"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time Limit (seconds)</label>
                <select
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(Number(e.target.value))}
                  className="w-full p-4 text-lg border-2 border-gray-300 rounded-xl focus:border-electric-blue focus:outline-none"
                >
                  <option value={15}>15 seconds</option>
                  <option value={30}>30 seconds</option>
                  <option value={45}>45 seconds</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Rounds</label>
                <select
                  value={totalRounds}
                  onChange={(e) => setTotalRounds(Number(e.target.value))}
                  className="w-full p-4 text-lg border-2 border-gray-300 rounded-xl focus:border-electric-blue focus:outline-none"
                >
                  <option value={3}>3 rounds</option>
                  <option value={5}>5 rounds</option>
                  <option value={7}>7 rounds</option>
                  <option value={10}>10 rounds</option>
                </select>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                  {error}
                </div>
              )}

              <Button
                onClick={createRoom}
                disabled={!isConnected}
                className="w-full py-4 bg-gradient-to-r from-electric-blue to-vibrant-pink text-white font-display font-bold text-lg rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50"
              >
                {isConnected ? 'Create Room' : 'Connecting...'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'join') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neon-green/20 to-sunny-yellow/20">
        <div className="bg-white/95 backdrop-blur-sm shadow-lg sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Button onClick={() => setMode('menu')} variant="ghost" className="flex items-center space-x-2">
                <ArrowLeft size={20} />
                <span>Back</span>
              </Button>
              <h1 className="font-display font-bold text-2xl">Join Room</h1>
              <div className="w-20"></div>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <h2 className="font-display font-bold text-3xl text-center mb-8">Join a Game</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full p-4 text-lg border-2 border-gray-300 rounded-xl focus:border-electric-blue focus:outline-none"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Room ID</label>
                <input
                  type="text"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                  className="w-full p-4 text-lg border-2 border-gray-300 rounded-xl focus:border-electric-blue focus:outline-none uppercase"
                  placeholder="Enter room ID"
                  maxLength={6}
                />
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                  {error}
                </div>
              )}

              <Button
                onClick={joinRoom}
                disabled={!isConnected}
                className="w-full py-4 bg-gradient-to-r from-electric-blue to-vibrant-pink text-white font-display font-bold text-lg rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50"
              >
                {isConnected ? 'Join Room' : 'Connecting...'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'lobby' && gameRoom) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neon-green/20 to-sunny-yellow/20">
        <div className="bg-white/95 backdrop-blur-sm shadow-lg sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Button onClick={onBack} variant="ghost" className="flex items-center space-x-2">
                <ArrowLeft size={20} />
                <span>Leave Room</span>
              </Button>
              <h1 className="font-display font-bold text-2xl">Game Lobby</h1>
              <div className="w-20"></div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-3xl">Room: {gameRoom.roomId}</h2>
              <Button
                onClick={copyRoomId}
                variant="outline"
                className="flex items-center space-x-2"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                <span>{copied ? 'Copied!' : 'Copy ID'}</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-700 mb-2">Game Settings</h3>
                <p>Time Limit: {gameRoom.settings.timeLimit}s</p>
                <p>Rounds: {gameRoom.settings.totalRounds}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-700 mb-2">Players ({gameRoom.players.length})</h3>
                <p>Ready: {gameRoom.players.filter(p => p.isReady).length}/{gameRoom.players.length}</p>
              </div>
            </div>

            <div className="space-y-3">
              {gameRoom.players.map((player) => (
                <div
                  key={player.id}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 ${
                    player.id === gameRoom.hostId
                      ? 'border-sunny-yellow bg-sunny-yellow/10'
                      : player.isReady
                      ? 'border-neon-green bg-neon-green/10'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {player.id === gameRoom.hostId && <Crown className="text-sunny-yellow" size={20} />}
                    <User size={20} className="text-gray-500" />
                    <span className="font-medium">{player.name}</span>
                    {player.id === gameRoom.hostId && <span className="text-sm text-gray-500">(Host)</span>}
                  </div>
                  <div className="flex items-center space-x-2">
                    {player.isReady && <Check className="text-neon-green" size={20} />}
                    {player.id === playerId && (
                      <Button
                        onClick={toggleReady}
                        variant={currentPlayer?.isReady ? "destructive" : "default"}
                        size="sm"
                      >
                        {currentPlayer?.isReady ? 'Not Ready' : 'Ready'}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {isHost && allReady && gameRoom.players.length >= 2 && (
              <div className="mt-8 text-center">
                <Button
                  onClick={startGame}
                  className="px-8 py-4 bg-gradient-to-r from-neon-green to-sunny-yellow text-white font-display font-bold text-lg rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300"
                >
                  <Play className="mr-2" size={20} />
                  Start Game
                </Button>
              </div>
            )}

            {!isHost && (
              <div className="mt-8 text-center text-gray-600">
                Waiting for host to start the game...
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
} 