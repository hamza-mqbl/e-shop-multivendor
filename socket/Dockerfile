# socket/Dockerfile — Socket.io server (port 4000)
FROM node:18-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

EXPOSE 4000
# entry file is index.js (NOT server.js) — see socket/package.json -> main
CMD ["node", "index.js"]
