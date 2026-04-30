# ─────────────────────────────────────────────────────────────────────────────
# Lingo2 Backend — Production Dockerfile
# Multi-stage build: builder (compile) → runner (minimal Alpine image)
# ─────────────────────────────────────────────────────────────────────────────

# ── Stage 1: Builder ─────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

RUN corepack enable pnpm

WORKDIR /app

# Install dependencies first (cache layer)
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# Copy source and build
COPY . .
RUN pnpm db:generate
RUN pnpm build

# ── Stage 2: Runner ──────────────────────────────────────────────────────────
FROM node:22-alpine AS runner

# Security: run as non-root user
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 fastify

WORKDIR /app

# Copy only the built output and production dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma/schema.prisma ./prisma/schema.prisma

# Prisma client needs the schema
RUN npm install -g @prisma/client 2>/dev/null || true

USER fastify

EXPOSE 3000

ENV NODE_ENV=production

HEALTHCHECK --interval=15s --timeout=5s --start-period=30s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/v1/health || exit 1

CMD ["node", "dist/main.js"]
