FROM node:22-bookworm-slim

# ── Chromium + fonts para Puppeteer (PDF generation) ─────────────────────────
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-liberation \
    fonts-noto-core \
    libgbm1 \
    libnss3 \
    libatk-bridge2.0-0 \
    libgtk-3-0 \
    libasound2 \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Usar Chromium del sistema — evita que puppeteer descargue su propio binario
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium \
    SCARF_ANALYTICS=false

WORKDIR /app

# Pin pnpm exacto para que coincida con package.json#packageManager
RUN corepack enable && corepack prepare pnpm@10.33.3 --activate

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --prod --frozen-lockfile

COPY . .

RUN mkdir -p /logs && chown -R node:node /app /logs

USER node

ENV PORT=3000 \
    NODE_ENV=production

EXPOSE 3000

CMD ["node", "index.js"]
