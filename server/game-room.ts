import { v4 as uuidv4 } from 'uuid';
import { GameEngine, PlayerState, Card } from './game-engine';

export class GameRoom {
  roomId: string;
  private engine: GameEngine;
  private players: Map<string, string> = new Map();
  private maxPlayers = 2;
  private gameStarted = false;

  constructor(creatorId: string, creatorName: string) {
    this.roomId = uuidv4().substring(0, 8);
    this.engine = new GameEngine();
    this.players.set(creatorId, creatorName);
    this.engine.addPlayer(creatorId, creatorName);
  }

  addPlayer(playerId: string, playerName: string): boolean {
    if (this.players.size >= this.maxPlayers) {
      return false;
    }
    this.players.set(playerId, playerName);
    this.engine.addPlayer(playerId, playerName);
    return true;
  }

  removePlayer(playerId: string): boolean {
    return this.players.delete(playerId);
  }

  getPlayers(): Array<{ id: string; name: string }> {
    return Array.from(this.players.entries()).map(([id, name]) => ({ id, name }));
  }

  isFull(): boolean {
    return this.players.size >= this.maxPlayers;
  }

  isEmpty(): boolean {
    return this.players.size === 0;
  }

  startGame(): void {
    this.engine.startGame();
    this.gameStarted = true;
  }

  playCard(playerId: string, cardIndex: number): { success: boolean; card?: Card } {
    return this.engine.playCard(playerId, cardIndex);
  }

  endTurn(): void {
    this.engine.nextTurn();
  }

  getCurrentTurn(): string | null {
    const player = this.engine.getCurrentPlayer();
    return player?.id || null;
  }

  getGameState(): {
    players: PlayerState[];
    discardPile: Card[];
    deckSize: number;
  } {
    return this.engine.getGameState();
  }
}
