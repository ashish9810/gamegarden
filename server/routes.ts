import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, type WebSocket } from "ws";
import { storage } from "./storage";
import type { NPATGameRoom, NPATPlayer, NPATGameState } from "@shared/schema";

// In-memory storage for game rooms (in production, this would be in a database)
const gameRooms = new Map<string, NPATGameRoom>();
const playerConnections = new Map<string, WebSocket>();

interface WebSocketMessage {
  type: string;
  data: any;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  const httpServer = createServer(app);

  // WebSocket server for multiplayer games - use separate port to avoid conflicts with Vite
  const wsPort = parseInt(process.env.WS_PORT || '3001', 10);
  const wss = new WebSocketServer({ port: wsPort });
  
  console.log(`WebSocket server running on port ${wsPort}`);

  wss.on('connection', (ws: WebSocket) => {
    console.log('New WebSocket connection');

    ws.on('message', (message: string) => {
      try {
        const parsedMessage: WebSocketMessage = JSON.parse(message);
        handleWebSocketMessage(ws, parsedMessage);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });

    ws.on('close', () => {
      // Remove player from room when they disconnect
      const playerId = Array.from(playerConnections.entries()).find(([id, socket]) => socket === ws)?.[0];
      if (playerId) {
        removePlayerFromRoom(playerId);
        playerConnections.delete(playerId);
      }
    });
  });

  function handleWebSocketMessage(ws: WebSocket, message: WebSocketMessage) {
    switch (message.type) {
      case 'CREATE_ROOM':
        handleCreateRoom(ws, message.data);
        break;
      case 'JOIN_ROOM':
        handleJoinRoom(ws, message.data);
        break;
      case 'LEAVE_ROOM':
        handleLeaveRoom(ws, message.data);
        break;
      case 'PLAYER_READY':
        handlePlayerReady(ws, message.data);
        break;
      case 'SUBMIT_ANSWERS':
        handleSubmitAnswers(ws, message.data);
        break;
      case 'START_GAME':
        handleStartGame(ws, message.data);
        break;
      case 'NEXT_ROUND':
        handleNextRound(ws, message.data);
        break;
      default:
        console.log('Unknown message type:', message.type);
    }
  }

  function handleCreateRoom(ws: WebSocket, data: { playerName: string; timeLimit: number; totalRounds: number }) {
    const roomId = generateRoomId();
    const playerId = generatePlayerId();
    
    const newPlayer: NPATPlayer = {
      id: playerId,
      name: data.playerName,
      score: 0,
      currentAnswers: { name: '', place: '', animal: '', thing: '' },
      isReady: false
    };

    const gameRoom: NPATGameRoom = {
      roomId,
      hostId: playerId,
      players: [newPlayer],
      gameState: {
        gameId: roomId,
        isMultiplayer: true,
        currentRound: 0,
        totalRounds: data.totalRounds,
        timeLimit: data.timeLimit,
        rounds: [],
        totalScore: 0,
        usedLetters: [],
        usedAnswers: { name: [], place: [], animal: [], thing: [] },
        isGameComplete: false,
        currentLetter: null,
        startTime: Date.now()
      },
      isGameStarted: false,
      settings: {
        timeLimit: data.timeLimit,
        totalRounds: data.totalRounds
      }
    };

    gameRooms.set(roomId, gameRoom);
    playerConnections.set(playerId, ws);

    // Send room created confirmation
    ws.send(JSON.stringify({
      type: 'ROOM_CREATED',
      data: { roomId, playerId, gameRoom }
    }));

    console.log(`Room ${roomId} created by ${data.playerName}`);
  }

  function handleJoinRoom(ws: WebSocket, data: { roomId: string; playerName: string }) {
    const room = gameRooms.get(data.roomId);
    if (!room) {
      ws.send(JSON.stringify({
        type: 'ERROR',
        data: { message: 'Room not found' }
      }));
      return;
    }

    if (room.isGameStarted) {
      ws.send(JSON.stringify({
        type: 'ERROR',
        data: { message: 'Game already in progress' }
      }));
      return;
    }

    const playerId = generatePlayerId();
    const newPlayer: NPATPlayer = {
      id: playerId,
      name: data.playerName,
      score: 0,
      currentAnswers: { name: '', place: '', animal: '', thing: '' },
      isReady: false
    };

    room.players.push(newPlayer);
    playerConnections.set(playerId, ws);

    // Notify all players in the room
    broadcastToRoom(data.roomId, {
      type: 'PLAYER_JOINED',
      data: { player: newPlayer, gameRoom: room }
    });

    console.log(`${data.playerName} joined room ${data.roomId}`);
  }

  function handleLeaveRoom(ws: WebSocket, data: { roomId: string; playerId: string }) {
    removePlayerFromRoom(data.playerId);
    playerConnections.delete(data.playerId);
  }

  function handlePlayerReady(ws: WebSocket, data: { roomId: string; playerId: string; isReady: boolean }) {
    const room = gameRooms.get(data.roomId);
    if (!room) return;

    const player = room.players.find(p => p.id === data.playerId);
    if (player) {
      player.isReady = data.isReady;
    }

    // Check if all players are ready
    const allReady = room.players.every(p => p.isReady);
    
    broadcastToRoom(data.roomId, {
      type: 'PLAYER_READY_UPDATE',
      data: { playerId: data.playerId, isReady: data.isReady, allReady, gameRoom: room }
    });
  }

  function handleStartGame(ws: WebSocket, data: { roomId: string; playerId: string }) {
    const room = gameRooms.get(data.roomId);
    if (!room || room.hostId !== data.playerId) return;

    room.isGameStarted = true;
    
    // Initialize first round
    const letter = getRandomLetter(room.gameState.usedLetters);
    room.gameState.currentLetter = letter;
    room.gameState.usedLetters.push(letter);
    room.gameState.currentRound = 1;

    broadcastToRoom(data.roomId, {
      type: 'GAME_STARTED',
      data: { gameRoom: room, letter }
    });

    // Start timer
    setTimeout(() => {
      handleRoundTimeout(data.roomId);
    }, room.settings.timeLimit * 1000);
  }

  function handleSubmitAnswers(ws: WebSocket, data: { roomId: string; playerId: string; answers: Record<string, string> }) {
    const room = gameRooms.get(data.roomId);
    if (!room) return;

    const player = room.players.find(p => p.id === data.playerId);
    if (player) {
      player.currentAnswers = data.answers;
    }

    // Check if all players have submitted
    const allSubmitted = room.players.every(p => 
      p.currentAnswers.name && p.currentAnswers.place && 
      p.currentAnswers.animal && p.currentAnswers.thing
    );

    if (allSubmitted) {
      // Calculate scores and prepare round results
      const roundResults = calculateRoundResults(room);
      
      broadcastToRoom(data.roomId, {
        type: 'ROUND_COMPLETE',
        data: { roundResults, gameRoom: room }
      });
    } else {
      // Notify that a player has submitted
      broadcastToRoom(data.roomId, {
        type: 'PLAYER_SUBMITTED',
        data: { playerId: data.playerId, gameRoom: room }
      });
    }
  }

  function handleNextRound(ws: WebSocket, data: { roomId: string; playerId: string }) {
    const room = gameRooms.get(data.roomId);
    if (!room || room.hostId !== data.playerId) return;

    if (room.gameState.currentRound >= room.settings.totalRounds) {
      // Game complete
      room.gameState.isGameComplete = true;
      broadcastToRoom(data.roomId, {
        type: 'GAME_COMPLETE',
        data: { gameRoom: room }
      });
      return;
    }

    // Start next round
    room.gameState.currentRound++;
    const letter = getRandomLetter(room.gameState.usedLetters);
    room.gameState.currentLetter = letter;
    room.gameState.usedLetters.push(letter);

    // Reset player answers
    room.players.forEach(player => {
      player.currentAnswers = { name: '', place: '', animal: '', thing: '' };
    });

    broadcastToRoom(data.roomId, {
      type: 'NEXT_ROUND',
      data: { gameRoom: room, letter }
    });

    // Start timer for new round
    setTimeout(() => {
      handleRoundTimeout(data.roomId);
    }, room.settings.timeLimit * 1000);
  }

  function handleRoundTimeout(roomId: string) {
    const room = gameRooms.get(roomId);
    if (!room || room.gameState.isGameComplete) return;

    // Force round completion
    const roundResults = calculateRoundResults(room);
    
    broadcastToRoom(roomId, {
      type: 'ROUND_TIMEOUT',
      data: { roundResults, gameRoom: room }
    });
  }

  function calculateRoundResults(room: NPATGameRoom) {
    const letter = room.gameState.currentLetter!;
    const results = room.players.map(player => {
      const answers = player.currentAnswers;
      const score = calculatePlayerScore(answers, letter);
      player.score += score;
      
      return {
        playerId: player.id,
        playerName: player.name,
        answers,
        score,
        totalScore: player.score
      };
    });

    return {
      letter,
      roundNumber: room.gameState.currentRound,
      results
    };
  }

  function calculatePlayerScore(answers: Record<string, string>, letter: string): number {
    let score = 0;
    const categories = ['name', 'place', 'animal', 'thing'] as const;
    
    categories.forEach(category => {
      const answer = answers[category]?.toUpperCase().trim();
      if (answer && answer.startsWith(letter)) {
        // Basic validation - in a real app, you'd check against word databases
        score += 10;
      }
    });

    return score;
  }

  function broadcastToRoom(roomId: string, message: WebSocketMessage) {
    const room = gameRooms.get(roomId);
    if (!room) return;

    room.players.forEach(player => {
      const ws = playerConnections.get(player.id);
      if (ws && ws.readyState === 1) { // WebSocket.OPEN
        ws.send(JSON.stringify(message));
      }
    });
  }

  function removePlayerFromRoom(playerId: string) {
    for (const [roomId, room] of Array.from(gameRooms.entries())) {
      const playerIndex = room.players.findIndex((p: NPATPlayer) => p.id === playerId);
      if (playerIndex !== -1) {
        room.players.splice(playerIndex, 1);
        
        if (room.players.length === 0) {
          // Delete empty room
          gameRooms.delete(roomId);
        } else if (room.hostId === playerId) {
          // Transfer host to next player
          room.hostId = room.players[0].id;
        }

        // Notify remaining players
        broadcastToRoom(roomId, {
          type: 'PLAYER_LEFT',
          data: { playerId, gameRoom: room }
        });
        break;
      }
    }
  }

  function generateRoomId(): string {
    return Math.random().toString(36).substr(2, 6).toUpperCase();
  }

  function generatePlayerId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  function getRandomLetter(usedLetters: string[]): string {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const availableLetters = alphabet.split('').filter(letter => !usedLetters.includes(letter));
    return availableLetters[Math.floor(Math.random() * availableLetters.length)];
  }

  return httpServer;
}
