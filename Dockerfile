FROM node:22-slim

RUN apt-get update && apt-get upgrade -y && rm -rf /var/lib/apt/lists/*

WORKDIR /src

RUN corepack enable pnpm

COPY package.json pnpm-lock.yaml* ./

RUN pnpm install --prod --frozen-lockfile

COPY . .

USER node


ENV PORT=3000
ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "index.js"]