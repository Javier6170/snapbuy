# backend/Dockerfile (context = .)

# 1) Build
FROM node:18-alpine AS builder
WORKDIR /app

# Quitar "backend/" de los COPY
COPY backend/package*.json ./
RUN npm ci

COPY backend/ ./
RUN npm run build

# 2) Runner
FROM node:18-alpine AS runner
WORKDIR /app

COPY backend/package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY backend/.env.sample .env

ARG PORT=4000
ENV PORT=${PORT}
EXPOSE ${PORT}

CMD ["node", "dist/main.js"]
