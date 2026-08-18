'use client';

import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import GameRoom from '@/components/GameRoom';
import Lobby from '@/components/Lobby';

export default function Home() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [gameState, setGameState] = useState<'lobby' | 'room' | 'playing'>('lobby');
  const [roomId, setRoomId] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState<string>('');

  useEffect(() => {
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleCreateRoom = (name: string) => {
    if (socket) {
      setPlayerName(name);
      socket.emit('create-room', name);
      setGameState('room');
    }
  };

  const handleJoinRoom = (name: string, rid: string) => {
    if (socket) {
      setPlayerName(name);
      setRoomId(rid);
      socket.emit('join-room', rid, name);
      setGameState('room');
    }
  };

  useEffect(() => {
    if (!socket) return;

    socket.on('room-created', (data) => {
      setRoomId(data.roomId);
    });

    socket.on('game-started', () => {
      setGameState('playing');
    });

    return () => {
      socket.off('room-created');
      socket.off('game-started');
    };
  }, [socket]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900">
      {gameState === 'lobby' && <Lobby onCreateRoom={handleCreateRoom} onJoinRoom={handleJoinRoom} />}
      {gameState === 'room' && socket && roomId && (
        <GameRoom socket={socket} roomId={roomId} playerName={playerName} />
      )}
    </main>
  );
}
