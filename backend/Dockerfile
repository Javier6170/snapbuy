FROM node:22.16.0-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22.16.0-alpine AS runner
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
ARG PORT=4000
ENV PORT=${PORT}
EXPOSE ${PORT}
CMD ["node", "dist/main.js"]
