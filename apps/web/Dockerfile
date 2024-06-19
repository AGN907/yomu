FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

FROM base AS deps

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json .npmrc ./
COPY apps/web/package.json /app/apps/web/package.json
COPY packages /app/packages/

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile


FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY ./apps/web ./apps/web
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules
COPY --from=deps /app/packages ./packages
COPY --from=deps /app/.npmrc ./
COPY --from=deps /app/tsconfig.base.json ./

# Delete database if it already exists
RUN rm -f apps/web/database/yomu.db
# Generate database migrations and create database
RUN pnpm --filter=web generate && pnpm --filter=web migrate

# Prune web app
RUN pnpm --filter=web deploy /app/pruned/web 

WORKDIR /app/pruned/web

RUN pnpm --filter=web build --no-lint

FROM base AS runner

WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
ENV PORT 3000

COPY --from=builder /app/apps/web/public ./public
COPY --from=builder /app/apps/web/database/yomu.db ./database/yomu.db
COPY --from=builder /app/pruned/web/.next/standalone ./
COPY --from=builder /app/pruned/web/.next/static ./.next/static

EXPOSE 3000

CMD [ "node", "server.js" ]