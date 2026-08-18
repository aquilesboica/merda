'use client';

import { useState } from 'react';

interface LobbyProps {
  onCreateRoom: (name: string) => void;
  onJoinRoom: (name: string, roomId: string) => void;
}

export default function Lobby({ onCreateRoom, onJoinRoom }: LobbyProps) {
  const [mode, setMode] = useState<'menu' | 'create' | 'join'>('menu');
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');

  const handleCreate = () => {
    if (playerName.trim()) {
      onCreateRoom(playerName);
    }
  };

  const handleJoin = () => {
    if (playerName.trim() && roomCode.trim()) {
      onJoinRoom(playerName, roomCode);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
        <h1 className="text-4xl font-bold text-center mb-8 text-purple-600">Card Game</h1>

        {mode === 'menu' && (
          <div className="space-y-4">
            <button
              onClick={() => setMode('create')}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition"
            >
              Create Room
            </button>
            <button
              onClick={() => setMode('join')}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition"
            >
              Join Room
            </button>
          </div>
        )}

        {mode === 'create' && (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <button
              onClick={handleCreate}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition"
            >
              Create
            </button>
            <button
              onClick={() => {
                setMode('menu');
                setPlayerName('');
              }}
              className="w-full bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 rounded-lg transition"
            >
              Back
            </button>
          </div>
        )}

        {mode === 'join' && (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <input
              type="text"
              placeholder="Room code"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <button
              onClick={handleJoin}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition"
            >
              Join
            </button>
            <button
              onClick={() => {
                setMode('menu');
                setPlayerName('');
                setRoomCode('');
              }}
              className="w-full bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 rounded-lg transition"
            >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
