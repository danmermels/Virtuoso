# --- Stage 1: Build frontend with Vite ---
FROM node:18 AS frontend-builder
WORKDIR /app/frontend

# Install frontend deps
COPY frontend/package*.json ./
RUN npm install

# Copy source files and build
COPY frontend/ .
RUN npm run build


# --- Stage 2: Backend setup ---
FROM node:18
WORKDIR /app

# Copy backend source
COPY backend/ backend/
COPY backend /app/backend
COPY data/ data/

# Install backend deps
WORKDIR /app/backend
RUN npm install

#install Better-SQLite3
RUN npm install better-sqlite3

# Copy built frontend into backend public folder
COPY --from=frontend-builder /app/frontend/dist /app/backend/public

# Expose port (optional)
EXPOSE 3000

# Run the backend
CMD ["node", "server.js"]
