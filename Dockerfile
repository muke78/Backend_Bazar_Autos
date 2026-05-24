# ═══════════════════════════════════════════════════════════════════════════
# Stage 1 — deps: instala node_modules de producción
# ═══════════════════════════════════════════════════════════════════════════
FROM node:22-bookworm-slim AS deps

# puppeteer-core no tiene postinstall — no descarga nada
ENV SCARF_ANALYTICS=false

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.33.3 --activate

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --prod --frozen-lockfile

# ═══════════════════════════════════════════════════════════════════════════
# Stage 2 — runner: imagen final limpia con Chromium + código
# ═══════════════════════════════════════════════════════════════════════════
FROM node:22-bookworm-slim

# Chromium + libs de runtime para Puppeteer (PDF generation)
# fonts-liberation cubre Latin/español — fonts-noto-core no es necesaria
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-liberation \
    libgbm1 \
    libnss3 \
    libatk-bridge2.0-0 \
    libgtk-3-0 \
    libasound2 \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium \
    SCARF_ANALYTICS=false

WORKDIR /app

# Solo node_modules del stage anterior (sin pnpm, sin cache de build)
COPY --from=deps /app/node_modules ./node_modules

COPY . .

RUN mkdir -p /logs && chown -R node:node /app /logs

USER node

ENV PORT=3000 \
    NODE_ENV=production

EXPOSE 3000

CMD ["node", "index.js"]
