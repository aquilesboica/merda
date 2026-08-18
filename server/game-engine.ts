export interface Card {
  id: string;
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
  rank: '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';
  power: number;
}

export interface PlayerState {
  id: string;
  name: string;
  hand: Card[];
  score: number;
  isActive: boolean;
}

export class GameEngine {
  private deck: Card[] = [];
  private players: Map<string, PlayerState> = new Map();
  private currentPlayerIndex = 0;
  private discardPile: Card[] = [];
  private gameOver = false;

  constructor() {
    this.initializeDeck();
  }

  private initializeDeck(): void {
    const suits: Card['suit'][] = ['hearts', 'diamonds', 'clubs', 'spades'];
    const ranks: Card['rank'][] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const rankPowers: Record<Card['rank'], number> = {
      '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
      'J': 11, 'Q': 12, 'K': 13, 'A': 14,
    };

    for (const suit of suits) {
      for (const rank of ranks) {
        this.deck.push({
          id: `${suit}-${rank}`,
          suit,
          rank,
          power: rankPowers[rank],
        });
      }
    }

    this.shuffleDeck();
  }

  private shuffleDeck(): void {
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  }

  addPlayer(id: string, name: string): void {
    this.players.set(id, {
      id,
      name,
      hand: [],
      score: 0,
      isActive: true,
    });
  }

  startGame(): void {
    this.players.forEach((player) => {
      for (let i = 0; i < 5; i++) {
        if (this.deck.length > 0) {
          player.hand.push(this.deck.pop()!);
        }
      }
    });
  }

  playCard(playerId: string, cardIndex: number): { success: boolean; card?: Card } {
    const player = this.players.get(playerId);
    if (!player || cardIndex >= player.hand.length) {
      return { success: false };
    }

    const card = player.hand.splice(cardIndex, 1)[0];
    this.discardPile.push(card);
    player.score += card.power;

    if (this.deck.length > 0) {
      player.hand.push(this.deck.pop()!);
    }

    return { success: true, card };
  }

  nextTurn(): string | null {
    if (this.gameOver) return null;

    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.size;
    const playerIds = Array.from(this.players.keys());
    return playerIds[this.currentPlayerIndex];
  }

  getCurrentPlayer(): PlayerState | null {
    const playerIds = Array.from(this.players.keys());
    return this.players.get(playerIds[this.currentPlayerIndex]) || null;
  }

  getGameState(): { players: PlayerState[]; discardPile: Card[]; deckSize: number } {
    return {
      players: Array.from(this.players.values()),
      discardPile: this.discardPile,
      deckSize: this.deck.length,
    };
  }
}
