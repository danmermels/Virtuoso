# --- Stage 1: Build frontend with Vite ---
FROM node:18 AS frontend-builder
WORKDIR /app/frontend

# Install frontend deps
COPY frontend/package*.json ./
RUN npm install

# Copy source files (after deps to keep cache clean)
COPY frontend/ ./

# Build frontend
RUN npm run build


# --- Stage 2: Backend setup ---
FROM node:18
WORKDIR /app

# Backend files
COPY backend/package*.json ./backend/
COPY backend/server.js ./backend/
COPY backend/src ./backend/src/
COPY backend/db ./backend/db/
COPY data/ ./data/

# Install backend deps
WORKDIR /app/backend
RUN npm install
RUN npm install better-sqlite3

# Copy frontend build output
COPY --from=frontend-builder /app/frontend/dist ./public/

EXPOSE 3000
CMD ["node", "server.js"]
