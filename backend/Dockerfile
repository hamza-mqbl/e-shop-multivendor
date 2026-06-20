# backend/Dockerfile — Express API (port 8000)
FROM node:18-alpine
WORKDIR /app

# bcrypt is a native addon; alpine (musl) needs build tools to compile it
RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

EXPOSE 8000
# entry file is server.js (see backend/package.json -> main/start)
CMD ["node", "server.js"]
