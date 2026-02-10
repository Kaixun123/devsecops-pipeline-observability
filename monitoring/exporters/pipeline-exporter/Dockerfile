FROM node:18-alpine

WORKDIR /apps
COPY package*.json ./
RUN npm ci --only=production
COPY server.js ./

EXPOSE 9091
CMD ["node", "server.js"]