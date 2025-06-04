FROM node:18

# Set working directory
WORKDIR /app

# --- Backend ---
COPY backend backend/
COPY data data/
WORKDIR /app/backend
RUN npm install

# --- Frontend ---
#WORKDIR /app/frontend
#COPY frontend frontend/
#RUN npm install
#RUN npm run build

# Copy frontend build into backend/public
RUN mkdir -p /app/backend/public
RUN cp -r dist/* /app/backend/public/

# --- Final run step ---
WORKDIR /app/backend
EXPOSE 3000
CMD ["node", "server.js"]
