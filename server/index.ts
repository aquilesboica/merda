import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { GameRoom } from './game-room';

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: { origin: 'http://localhost:3000' },
});

const gameRooms = new Map();

io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.id}`);

  socket.on('create-room', (playerName) => {
    const room = new GameRoom(socket.id, playerName);
    gameRooms.set(room.roomId, room);
    socket.join(room.roomId);
    socket.emit('room-created', {
      roomId: room.roomId,
      players: room.getPlayers(),
    });
  });

  socket.on('join-room', (roomId, playerName) => {
    const room = gameRooms.get(roomId);
    if (room && room.addPlayer(socket.id, playerName)) {
      socket.join(roomId);
      io.to(roomId).emit('player-joined', {
        players: room.getPlayers(),
        gameState: room.getGameState(),
      });

      if (room.isFull()) {
        room.startGame();
        io.to(roomId).emit('game-started', {
          gameState: room.getGameState(),
          currentTurn: room.getCurrentTurn(),
        });
      }
    } else {
      socket.emit('join-failed', 'Room not found or full');
    }
  });

  socket.on('play-card', (roomId, cardIndex) => {
    const room = gameRooms.get(roomId);
    if (room) {
      const result = room.playCard(socket.id, cardIndex);
      if (result.success) {
        io.to(roomId).emit('card-played', {
          player: socket.id,
          card: result.card,
          gameState: room.getGameState(),
          currentTurn: room.getCurrentTurn(),
        });
      }
    }
  });

  socket.on('end-turn', (roomId) => {
    const room = gameRooms.get(roomId);
    if (room) {
      room.endTurn();
      io.to(roomId).emit('turn-ended', {
        gameState: room.getGameState(),
        currentTurn: room.getCurrentTurn(),
      });
    }
  });

  socket.on('disconnect', () => {
    console.log(`Player disconnected: ${socket.id}`);
    gameRooms.forEach((room) => {
      if (room.removePlayer(socket.id)) {
        io.to(room.roomId).emit('player-left', {
          players: room.getPlayers(),
        });
        if (room.isEmpty()) {
          gameRooms.delete(room.roomId);
        }
      }
    });
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Card Game Server running on port ${PORT}`);
});
