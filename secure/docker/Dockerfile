FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS production

# Install necessary scanner tools for the backend container (Nmap, Nikto, etc.)
RUN apk add --no-cache nmap nmap-scripts nikto python3

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/scanners ./scanners
COPY --from=builder /app/ecosystem ./ecosystem

ENV NODE_ENV=production
ENV PORT=5001

EXPOSE 5001

# Start the application using PM2 (for clustering within the container, though docker-compose might handle scaling)
RUN npm install pm2 -g
CMD ["pm2-runtime", "ecosystem/ecosystem.config.js"]