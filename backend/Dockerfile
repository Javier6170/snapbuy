# backend/Dockerfile

# 1) Build stage
FROM node:18-alpine AS builder
WORKDIR /app

# Copiamos sólo package.json y lock para acelerar cache
COPY package*.json ./
RUN npm ci

# Copiamos el resto del código y compilamos
COPY . .
RUN npm run build

# 2) Production stage
FROM node:18-alpine AS runner
WORKDIR /app

# Instalamos sólo dependencias de producción
COPY package*.json ./
RUN npm ci --omit=dev

# Traemos el código compilado
COPY --from=builder /app/dist ./dist

# Puerto que usará Railway (por defecto 4000)
ARG PORT=4000
ENV PORT=${PORT}
EXPOSE ${PORT}

# Arrancamos la app
CMD ["node", "dist/main.js"]
