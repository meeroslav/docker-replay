FROM node:22-slim

ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_PATH=/app/api/dist/workspace_modules

RUN corepack enable

WORKDIR /app

COPY apps/nestapp apps/nestapp/
COPY patches patches/
RUN rm -rf apps/nestapp/dist
COPY nx.json nx.json
COPY pnpm-workspace.yaml pnpm-workspace.yaml
COPY package.json package.json
COPY pnpm-lock.yaml pnpm-lock.yaml
COPY eslint.config.mjs eslint.config.mjs
COPY jest.preset.js jest.preset.js
COPY tsconfig.json tsconfig.json
COPY tsconfig.base.json tsconfig.base.json
COPY .gitignore .gitignore
COPY .github .github/

RUN pnpm install --frozen-lockfile

RUN NX_DAEMON=false NX_VERBOSE_LOGGING=true pnpm nx build nestapp