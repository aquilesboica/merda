'use client';

import { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import Card from './Card';

interface GameRoomProps {
  socket: Socket;
  roomId: string;
  playerName: string;
}

interface Player {
  id: string;
  name: string;
  hand: any[];
  score: number;
}

export default function GameRoom({ socket, roomId, playerName }: GameRoomProps) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentTurn, setCurrentTurn] = useState<string | null>(null);
  const [gameState, setGameState] = useState<any>(null);
  const [isMyTurn, setIsMyTurn] = useState(false);

  useEffect(() => {
    socket.on('player-joined', (data) => {
      setPlayers(data.players);
      setGameState(data.gameState);
    });

    socket.on('game-started', (data) => {
      setGameState(data.gameState);
      setCurrentTurn(data.currentTurn);
    });

    socket.on('card-played', (data) => {
      setGameState(data.gameState);
      setCurrentTurn(data.currentTurn);
    });

    socket.on('turn-ended', (data) => {
      setGameState(data.gameState);
      setCurrentTurn(data.currentTurn);
    });

    return () => {
      socket.off('player-joined');
      socket.off('game-started');
      socket.off('card-played');
      socket.off('turn-ended');
    };
  }, [socket]);

  useEffect(() => {
    setIsMyTurn(currentTurn === socket.id);
  }, [currentTurn, socket]);

  const handlePlayCard = (cardIndex: number) => {
    if (isMyTurn) {
      socket.emit('play-card', roomId, cardIndex);
    }
  };

  const handleEndTurn = () => {
    socket.emit('end-turn', roomId);
  };

  const myPlayer = gameState?.players.find((p: Player) => p.name === playerName);

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Card Game - {roomId}</h1>
          <p className="text-purple-200">Playing as: {playerName}</p>
        </div>

        <div className="bg-green-700 rounded-lg p-8 mb-8 min-h-64">
          <div className="text-center">
            {gameState && (
              <div>
                <p className="text-white text-lg mb-4">Deck: {gameState.deckSize} cards</p>
                <p className="text-yellow-300 text-xl font-bold">
                  {isMyTurn ? "Your Turn" : "Opponent's Turn"}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {gameState?.players.map((player: Player) => (
            <div
              key={player.id}
              className={`p-4 rounded-lg ${
                currentTurn === player.id
                  ? 'bg-yellow-500 border-4 border-yellow-300'
                  : 'bg-purple-600'
              }`}
            >
              <h3 className="text-white font-bold text-lg">{player.name}</h3>
              <p className="text-white">Score: {player.score}</p>
              <p className="text-white">Hand: {player.hand.length} cards</p>
            </div>
          ))}
        </div>

        {myPlayer && (
          <div>
            <h2 className="text-white text-2xl font-bold mb-4">Your Hand</h2>
            <div className="flex flex-wrap gap-4 justify-center mb-8">
              {myPlayer.hand.map((card: any, index: number) => (
                <div key={index} onClick={() => handlePlayCard(index)} className="cursor-pointer">
                  <Card card={card} />
                </div>
              ))}
            </div>

            {isMyTurn && (
              <div className="text-center">
                <button
                  onClick={handleEndTurn}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition"
                >
                  End Turn
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
