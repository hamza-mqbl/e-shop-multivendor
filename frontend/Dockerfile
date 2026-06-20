# frontend/Dockerfile — React (CRA) built to static files, served by nginx
FROM node:18-alpine AS builder
WORKDIR /app

COPY package*.json ./
# --legacy-peer-deps required: MUI v4 conflicts with React 18 peers (see README)
RUN npm ci --legacy-peer-deps

COPY . .
# don't let eslint warnings fail the production build
ENV CI=false
RUN npm run build

# --- serve stage ---
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
# SPA routing: send unknown paths back to index.html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
