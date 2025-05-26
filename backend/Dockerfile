# backend/Dockerfile

# 1) Stage de build
FROM node:18-alpine AS builder
WORKDIR /app

# Copiamos package.json y lockfile e instalamos deps
COPY backend/package*.json ./
RUN npm ci

# Copiamos el resto del código y compilamos
COPY backend/ ./
RUN npm run build

# 2) Stage de producción
FROM node:18-alpine AS runner
WORKDIR /app

# Solo instalamos deps de producción
COPY backend/package*.json ./
RUN npm ci --omit=dev

# Copiamos artefactos compilados
COPY --from=builder /app/dist ./dist

# Copiamos archivo de vars de entorno de ejemplo (opcional)
COPY backend/.env.example .env

# Exponemos el puerto configurado
ARG PORT=4000
ENV PORT=${PORT}
EXPOSE ${PORT}

# Arrancamos en modo producción
CMD ["node", "dist/main.js"]
