# 🐳 Docker Notes — Complete Cheat Sheet

> Minimal examples for every topic. Grounded in this project (backend + socket + frontend + mongodb).

---

## 1. Container vs Image

- **Image** = the recipe / blueprint (read-only, built once). Like a class.
- **Container** = a running instance of an image. Like an object.

```
1 image  →  many containers
```

```bash
docker images        # list images (blueprints)
docker ps            # list running containers
docker ps -a         # list ALL containers (incl. stopped)
```

---

## 2. Dockerfile (Basic)

A recipe to build an image, step by step. Each line = one cached layer.

```dockerfile
FROM node:18-alpine        # base image
WORKDIR /app               # working dir inside container
COPY package*.json ./      # copy deps file FIRST (for caching)
RUN npm ci --omit=dev      # install deps
COPY . .                   # copy rest of code
EXPOSE 8000                # document the port
CMD ["node", "server.js"]  # start command
```

**Why copy package.json before code?** → if only code changes, Docker reuses the cached `npm ci` layer (faster builds).

---

## 3. Dockerfile (Multi-stage build)

Build in one stage, ship only the result in a smaller final stage.

```dockerfile
# --- build stage ---
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN npm run build           # produces /app/build

# --- serve stage (tiny final image) ---
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Final image = just nginx + static files (no Node, no node_modules). **Much smaller.**

---

## 4. docker build

```bash
docker build -t myapp ./backend      # build image named "myapp" from ./backend
docker build -t myapp:v1 .           # tag a version
docker build --no-cache -t myapp .   # ignore cache, rebuild everything
```

- `-t` = tag/name
- last argument = build context (folder sent to Docker)

---

## 5. nginx.conf (SPA config)

React/SPA needs all unknown routes to return `index.html` (client-side routing).

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;   # ← SPA fallback
    }
}
```

Without `try_files`, refreshing on `/dashboard` gives a 404.

---

## 6. docker run + important flags

```bash
docker run -d -p 3000:80 --name web --restart unless-stopped myapp
```

| Flag | Meaning |
|---|---|
| `-d` | detached (run in background) |
| `-p 3000:80` | port map `HOST:CONTAINER` |
| `--name web` | give the container a name |
| `--restart unless-stopped` | auto-restart on crash/reboot |
| `-e KEY=value` | set an environment variable |
| `-v ./data:/app/data` | mount a volume |
| `--rm` | auto-delete container when it stops |

```bash
docker stop web      # stop
docker start web     # start again
docker rm web        # delete
docker logs -f web   # follow logs
```

---

## 7. Docker Volumes

Containers are temporary — data inside dies with them. Volumes persist data.

**Bind mount** — map a host folder (great for dev / live code sync):
```bash
docker run -v $(pwd)/uploads:/app/uploads myapp
```

**Named volume** — Docker-managed storage (great for databases):
```bash
docker volume create mongo-data
docker run -v mongo-data:/data/db mongo:6
```

| Type | Use when |
|---|---|
| Bind mount | dev code sync, local files you edit |
| Named volume | databases, data you don't edit by hand |

```bash
docker volume ls           # list
docker volume rm name      # delete
```

---

## 8. Docker Compose

Define a whole multi-container app in one YAML file. Run it all with one command.

```yaml
services:
  mongodb:
    image: mongo:6
    ports: ["27017:27017"]
    volumes: [mongo-data:/data/db]

  backend:
    build: ./backend
    ports: ["8000:8000"]
    environment:
      - MONGO_URL=mongodb://mongodb:27017/eshop   # ← service name!
    depends_on: [mongodb]

volumes:
  mongo-data:
```

```bash
docker compose up --build    # build + start everything
docker compose up -d         # start in background
docker compose down          # stop + remove
docker compose down -v       # ...and delete volumes (wipes DB!)
docker compose ps            # status
docker compose logs -f web   # logs for one service
```

---

## 9. Docker Networking ⭐

Compose puts all services on one private network. They reach each other by **service name**.

```
Inside a container  →  use SERVICE NAME   (mongodb, backend, socket)
From laptop/browser →  use localhost:PORT (localhost:8000)
```

- `localhost` = "me, this machine." **Every machine/container has its own.**
- Docker has a built-in DNS that turns `mongodb` → its container IP automatically.
- Service names work **only inside** the network — the browser can't use them.
- `ports:` (port forwarding) is the **only door** from your laptop into a container.

```bash
docker network ls                              # list networks
docker network inspect <name>                  # see attached containers + IPs
docker compose exec backend ping mongodb       # prove name → IP works
```

**The 3 rules:**
1. container → container = service name
2. laptop/browser → container = `localhost:hostport`
3. no `ports:` mapping = laptop can't reach it (but containers still can)

---

## 10. .dockerignore & Image Optimization

**`.dockerignore`** = `.gitignore` for builds. Keeps junk/secrets out of the image.

```
node_modules     # installed fresh inside the container
.git             # huge, useless in an image
config/.env      # 🔒 never bake secrets in
Dockerfile
*.log
```

**Optimization tips:**
- Use small base images (`alpine`).
- Use **multi-stage** builds (drop build tools from final image).
- Copy `package.json` before code (better caching).
- Use `--omit=dev` / `--production`.
- Run as a non-root user:
  ```dockerfile
  RUN addgroup -S app && adduser -S app -G app
  USER app
  ```

```bash
docker images        # check image sizes (before/after)
```

---

## 11. Push to Docker Hub

Docker Hub = GitHub for images.

```bash
docker login                                   # authenticate
docker tag myapp username/myapp:v1             # name as username/repo:tag
docker push username/myapp:v1                  # upload
```

Pull & run anywhere:
```bash
docker pull username/myapp:v1
docker run -p 8000:8000 username/myapp:v1
```

- Tag **must** include your username.
- `:latest` is just a default tag name, **not** "newest" — tag intentionally.

---

## 12. Multi-container setup

Frontend + Backend + DB working together (this project = mongodb + backend + socket + frontend).

- One `docker-compose.yml` defines all services.
- They talk by **service name** over the shared network.
- `depends_on` controls **start order** (not readiness — see below).
- Each container = **one job** (one process per container).

```bash
docker compose up --build    # the whole stack with one command
```

---

## 13. Best Practices & Common Issues

### ✅ Best practices
- One process per container.
- Small base images + multi-stage builds.
- `.dockerignore` everything unnecessary.
- Never bake secrets — inject via `env_file` / `environment`.
- Pin versions (`node:18.20-alpine`, not just `latest`).
- Run as non-root user.
- Use named volumes for databases.

### 🐛 Common issues + fixes

**Startup race (depends_on doesn't wait for READY):**
```yaml
mongodb:
  healthcheck:
    test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
    interval: 10s
    retries: 5
backend:
  depends_on:
    mongodb:
      condition: service_healthy   # ← wait until Mongo actually answers
```

**Port already in use:**
```bash
lsof -i :8000                # find what's using it
# or change mapping: "8001:8000"
```

**Code change not showing:**
```bash
docker compose up --build    # rebuild
```

**Container exits immediately:**
```bash
docker compose logs backend  # read why it died
```

**Disk full:**
```bash
docker system df             # what's using space
docker system prune          # clean unused stuff
```

### 🔧 Daily debug toolkit
```bash
docker compose ps              # status
docker compose logs -f <svc>   # live logs (most used!)
docker compose exec <svc> sh   # shell into a container
docker stats                   # live CPU/RAM
docker system prune            # clean up
```

---

## 🎯 The one-line summaries

| Concept | Remember |
|---|---|
| Image vs Container | recipe vs running meal |
| Dockerfile | the recipe |
| Multi-stage | build big, ship small |
| Volume | data that survives the container |
| Compose | whole app in one file |
| Networking | container→container = service name; laptop→container = localhost:port |
| localhost | "me" — every machine has its own |
| .dockerignore | .gitignore for builds |
| Docker Hub | GitHub for images |
| depends_on | waits for START, not READY (use healthcheck) |
