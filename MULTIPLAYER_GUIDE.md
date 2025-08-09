# NPAT Multiplayer Guide

## 🎮 How to Play Multiplayer NPAT

The NPAT (Name, Place, Animal, Thing) game now supports real-time multiplayer functionality! Here's how to get started:

### 🚀 Getting Started

1. **Start the Server**
   ```bash
   npm install
   PORT=3000 npm run dev
   ```

2. **Open the Game**
   - Navigate to `http://localhost:3000`
   - Click on "NPAT" in the navigation
   - Select "Multiplayer" mode

### 🏠 Creating a Room

1. **Click "Create Room"**
2. **Enter your name** (this will be displayed to other players)
3. **Choose game settings:**
   - **Time Limit**: 15, 30, or 45 seconds per round
   - **Number of Rounds**: 3, 5, 7, or 10 rounds
4. **Click "Create Room"**

### 🔗 Joining a Room

1. **Click "Join Room"**
2. **Enter your name**
3. **Enter the Room ID** (6-character code shared by the host)
4. **Click "Join Room"**

### 🎯 Game Lobby

Once in the lobby, you'll see:
- **Room ID** (click to copy)
- **Game settings** (time limit, rounds)
- **Player list** with ready status
- **Host controls** (only visible to the host)

### 🎮 Playing the Game

1. **All players must click "Ready"**
2. **Host clicks "Start Game"** (requires at least 2 players)
3. **Each round:**
   - A random letter appears
   - All players have the same time limit
   - Enter a Name, Place, Animal, and Thing starting with that letter
   - Submit your answers before time runs out
4. **Round results** show everyone's answers and scores
5. **Host advances to next round** or game ends

### 🏆 Scoring System

- **10 points** per valid answer
- **Valid answers** must:
  - Start with the given letter
  - Be a real word from our database
  - Not be duplicated by other players

### 🌐 Technical Features

- **Real-time WebSocket communication**
- **Automatic room management**
- **Player disconnection handling**
- **Host migration** (if host leaves)
- **Global word validation** with comprehensive databases

### 🎨 UI Features

- **Beautiful animated interface**
- **Real-time player status**
- **Copy room ID functionality**
- **Responsive design** for mobile and desktop
- **Visual feedback** for submissions and scores

### 🔧 Troubleshooting

**Can't connect?**
- Make sure the server is running on `http://localhost:3000`
- Check that WebSocket connections are enabled

**Room not found?**
- Verify the Room ID is correct (6 characters, case-insensitive)
- Make sure the room hasn't been deleted

**Players not showing up?**
- Refresh the page
- Check your internet connection
- Try rejoining the room

### 🚀 Future Enhancements

- **Chat functionality**
- **Custom word lists**
- **Tournament mode**
- **Persistent user accounts**
- **Leaderboards**
- **Spectator mode**

---

**Enjoy playing NPAT with friends! 🎉** 