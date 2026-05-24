# ═══════════════════════════════════════════════════════════════════════════
# Stage 1 — deps: instala node_modules de producción
# ═══════════════════════════════════════════════════════════════════════════
FROM node:22-bookworm-slim AS deps

ENV SCARF_ANALYTICS=false

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.33.3 --activate

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --prod --frozen-lockfile

# ═══════════════════════════════════════════════════════════════════════════
# Stage 2 — runner: imagen final con Chromium + tini + código
# ═══════════════════════════════════════════════════════════════════════════
FROM node:22-bookworm-slim

# tini: PID 1 correcto → SIGTERM llega al proceso Node (no se queda zombie)
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-liberation \
    libgbm1 \
    libnss3 \
    libatk-bridge2.0-0 \
    libgtk-3-0 \
    libasound2 \
    tini \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium \
    SCARF_ANALYTICS=false

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN mkdir -p /logs && chown -R node:node /app /logs

USER node

# ── Tuning para 1 vCPU / 1 GB RAM (Digital Ocean Basic) ───────────────────
ENV PORT=3000 \
    NODE_ENV=production \
    # 1 vCPU: UV_THREADPOOL_SIZE=4 (default) — no hay cores extra para más
    UV_THREADPOOL_SIZE=4 \
    # Heap: 300MB para Node.js
    # MySQL necesita ~350MB, OS ~150MB → 300MB es el techo seguro
    NODE_OPTIONS="--max-old-space-size=300"

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "fetch('http://localhost:3000/api/v1').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

ENTRYPOINT ["/usr/bin/tini", "--"]

# 1 vCPU = cluster.js no ayuda (master + 1 worker = overhead sin ganancia).
# Un solo proceso Node usa el core sin overhead de IPC / fork.
CMD ["node", "index.js"]
