FROM node:18-alpine AS builder
WORKDIR /apps
COPY package*.json ./
RUN npm ci --only=production
COPY src/ ./src/

FROM node:18-alpine
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
WORKDIR /apps
COPY --from=builder --chown=nodejs:nodejs /apps/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /apps/src ./src
COPY --chown=nodejs:nodejs package.json ./
USER nodejs
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"
CMD ["node", "src/index.js"]