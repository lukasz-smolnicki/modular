FROM node:20-alpine AS builder
WORKDIR /app

COPY packages/types ./packages/types
COPY apps/api/package*.json ./apps/api/
RUN cd apps/api && npm install --no-audit --no-fund

COPY tsconfig.json ./tsconfig.json
COPY apps/api/tsconfig.json ./apps/api/tsconfig.json
COPY apps/api/src ./apps/api/src
RUN npx tsc -p apps/api/tsconfig.json

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY apps/api/package*.json ./apps/api/
RUN cd apps/api && npm install --omit=dev --no-audit --no-fund

COPY --from=builder /app/apps/api/dist ./apps/api/dist
WORKDIR /app/apps/api

EXPOSE 8080
CMD ["node", "dist/main.js"]
