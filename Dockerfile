FROM node:24-alpine AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
RUN apk add --no-cache openssl openssl-dev

# ── deps ─────────────────────────────────────────────
FROM base AS deps
COPY package*.json ./
# --ignore-scripts: postinstall (prisma generate) bu aşamada schema'sız çalışır;
# prisma generate zaten builder aşamasında (aşağıda) yapılıyor.
RUN npm ci --ignore-scripts

# ── builder ──────────────────────────────────────────
FROM base AS builder
# next.config.ts bunu görünce output:"standalone" üretir (Vercel'de kapalı kalır)
ENV DOCKER_BUILD=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# ── runner ───────────────────────────────────────────
FROM base AS runner
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY docker-entrypoint.sh ./docker-entrypoint.sh

RUN chmod +x docker-entrypoint.sh

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
