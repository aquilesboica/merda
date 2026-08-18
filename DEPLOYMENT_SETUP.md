# 🚀 Guia de Setup para Deployment Automático

## Passo 1: Criar arquivos de configuração

### 1.1 `.github/workflows/deploy.yml`
```yaml
name: Deploy Card Game

on:
  push:
    branches: [card-game, main]
  pull_request:
    branches: [card-game, main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build frontend
        run: npm run build
      
      - name: Build server
        run: npm run build:server

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/card-game' && github.event_name == 'push'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build Next.js
        run: npm run build
      
      - name: Deploy to Vercel
        uses: vercel/action@v4
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          scope: ${{ secrets.VERCEL_ORG_ID }}

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/card-game' && github.event_name == 'push'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build:server
      
      - name: Deploy to Railway
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
        run: |
          npm install -g @railway/cli
          railway link ${{ secrets.RAILWAY_PROJECT_ID }}
          railway up --detach
```

### 1.2 `Dockerfile` (Backend)
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

RUN npm run build:server

EXPOSE 3001

CMD ["node", "dist/index.js"]
```

### 1.3 `Dockerfile.frontend` (Frontend)
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package*.json ./

EXPOSE 3000

CMD ["npm", "start"]
```

### 1.4 `docker-compose.yml`
```yaml
version: '3.8'

services:
  backend:
    build: .
    ports:
      - "3001:3001"
    environment:
      NODE_ENV: production
      PORT: 3001
    restart: unless-stopped

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      NEXT_PUBLIC_API_URL: http://localhost:3001
    depends_on:
      - backend
    restart: unless-stopped
```

### 1.5 `.env.example`
```
# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001

# Backend
NODE_ENV=development
PORT=3001
```

### 1.6 `vercel.json`
```json
{
  "buildCommand": "npm run build",
  "installCommand": "npm ci",
  "devCommand": "npm run dev",
  "framework": "nextjs",
  "env": {
    "NEXT_PUBLIC_API_URL": "@next_public_api_url",
    "NEXT_PUBLIC_SOCKET_URL": "@next_public_socket_url"
  }
}
```

### 1.7 `railway.json`
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "nixpacks"
  },
  "deploy": {
    "startCommand": "npm run server",
    "restartPolicyType": "on_failure",
    "restartPolicyMaxRetries": 5
  }
}
```

## Passo 2: Configurar Secrets no GitHub

1. Vai para `https://github.com/aquilesboica/merda/settings/secrets/actions`
2. Cria os seguintes secrets:

### Para Vercel (Frontend):
- `VERCEL_TOKEN`: Token de autenticação do Vercel
- `VERCEL_ORG_ID`: ID da organização
- `VERCEL_PROJECT_ID`: ID do projeto

### Para Railway (Backend):
- `RAILWAY_TOKEN`: Token de autenticação do Railway
- `RAILWAY_PROJECT_ID`: ID do projeto

## Passo 3: Setup do Vercel (Frontend)

1. Vai para [vercel.com](https://vercel.com)
2. Conecta a tua conta GitHub
3. Importa o projeto `aquilesboica/merda`
4. Configura as variáveis de ambiente:
   - `NEXT_PUBLIC_API_URL`: URL do teu backend (ex: `https://card-game-backend.railway.app`)
   - `NEXT_PUBLIC_SOCKET_URL`: URL do WebSocket

## Passo 4: Setup do Railway (Backend)

1. Vai para [railway.app](https://railway.app)
2. Cria um novo projeto
3. Conecta ao GitHub (repositório `aquilesboica/merda`)
4. Seleciona a branch `card-game`
5. Configura as variáveis:
   - `NODE_ENV`: `production`
   - `PORT`: `3001`

## Passo 5: Testar o Deploy

```bash
# Fazer um push para a branch card-game
git add .
git commit -m "Add deployment configuration"
git push origin card-game
```

O pipeline de CI/CD vai:
1. ✅ Fazer build e testes
2. 📦 Deploy automático no Vercel (frontend)
3. 🚀 Deploy automático no Railway (backend)

## URLs do Jogo Online

Após o deploy:
- **Frontend**: `https://[seu-projeto].vercel.app`
- **Backend API**: `https://[seu-projeto].railway.app`

## Docker Local (Alternativa)

Para testar localmente com Docker:

```bash
# Build e run
docker-compose up --build

# Acessa
# Frontend: http://localhost:3000
# Backend: http://localhost:3001
```

---

**Precisas de ajuda com algum passo? Avisa!** 🎮
