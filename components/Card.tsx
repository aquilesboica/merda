'use client';

interface CardProps {
  card: {
    suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
    rank: string;
  };
}

const suitSymbols = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠',
};

const suitColors = {
  hearts: 'text-red-600',
  diamonds: 'text-red-600',
  clubs: 'text-black',
  spades: 'text-black',
};

export default function Card({ card }: CardProps) {
  return (
    <div className="w-24 h-32 bg-white rounded-lg shadow-lg p-2 border-2 border-gray-300 flex flex-col items-center justify-center hover:shadow-xl hover:scale-105 transition">
      <div className={`text-3xl font-bold ${suitColors[card.suit]}`}>{card.rank}</div>
      <div className="text-4xl">{suitSymbols[card.suit]}</div>
    </div>
  );
}
