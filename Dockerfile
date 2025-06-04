# --- Stage 1: Build frontend with Vite ---
FROM node:18 AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build

# --- Stage 2: Backend ---
FROM node:18
WORKDIR /app

COPY backend/package*.json ./backend/
COPY backend/server.js ./backend/
COPY backend/src ./backend/src/
COPY backend/db ./backend/db/
COPY data/ ./data/

WORKDIR /app/backend
RUN npm install
RUN npm install better-sqlite3

# 👇 Ensure built frontend is copied properly
COPY --from=frontend-builder /app/backend/public ./backend/public

EXPOSE 3000
CMD ["node", "server.js"]
