# Card Game Online

Multiplayer online card game built with Next.js, TypeScript, and Socket.io

## Features

✅ Real-time multiplayer gameplay
✅ Card dealing and hand management
✅ Turn-based gameplay
✅ Score tracking
✅ WebSocket communication for instant updates

## Installation

```bash
npm install
```

## Running the Game

### Development Mode

```bash
npm run dev
```

This starts both the Next.js frontend (port 3000) and Socket.io backend (port 3001).

### Production Build

```bash
npm run build
npm start
```

## Game Rules

1. Create or join a room with a friend
2. Each player starts with 5 cards
3. Take turns playing cards from your hand
4. Your score increases by the card's power level
5. A new card is drawn after each play
6. First player to reach 50 points wins!

## Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Backend**: Express, Socket.io, TypeScript
- **Real-time Communication**: WebSocket (Socket.io)
- **Cards**: Standard 52-card deck

## Architecture

server/ - Backend Socket.io server
app/ - Next.js frontend
components/ - React components

## Future Enhancements

- Authentication system
- Persistent player profiles
- Leaderboards
- Different card games
- Card animations
- Sound effects
- Mobile optimization
