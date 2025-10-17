FROM node:20-alpine AS builder
WORKDIR /repo

COPY packages/types/package*.json ./packages/types/
COPY apps/api/package*.json ./apps/api/
RUN cd apps/api && npm install --no-audit --no-fund

COPY packages/types ./packages/types
COPY apps/api/tsconfig*.json ./apps/api/
COPY apps/api/src ./apps/api/src
RUN cd apps/api && npx tsc

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY apps/api/package*.json ./apps/api/
RUN cd apps/api && npm install --omit=dev --no-audit --no-fund

COPY --from=builder /repo/apps/api/dist ./apps/api/dist

EXPOSE 8080
CMD ["node", "apps/api/dist/main.js"]
