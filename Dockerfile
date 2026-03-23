# Stage 1: Build frontend
FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Setup backend
FROM node:18-alpine
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ ./
COPY --from=frontend-build /app/frontend/dist ../frontend/dist

EXPOSE 5001
CMD ["node", "src/index.js"]