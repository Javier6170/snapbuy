# frontend/Dockerfile

# 1) Stage de build
FROM node:18-alpine AS builder
WORKDIR /app

# Instalamos deps y compilamos
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# 2) Stage de producción con Nginx
FROM nginx:stable-alpine AS runner
# Copiamos build de React al directorio de Nginx
COPY --from=builder /app/build /usr/share/nginx/html

# (Opcional) Copia tu config de Nginx si quieres rutas SPA más avanzadas
# COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
