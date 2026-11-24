FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm config set fetch-timeout 600000 \
 && npm config set fetch-retries 5 \
 && npm config set fetch-retry-mintimeout 20000 \
 && npm config set fetch-retry-maxtimeout 120000 \
 && npm ci --omit=dev --no-audit --no-fund
COPY server.js migrate.js ./
COPY migrations/ ./migrations/
USER node
EXPOSE 3000
CMD ["node", "server.js"]
