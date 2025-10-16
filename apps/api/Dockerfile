FROM node:20-alpine AS builder
WORKDIR /app

COPY apps/api/package*.json ./
COPY packages/types /packages/types
RUN npm install --no-audit --no-fund

COPY apps/api/tsconfig.json ./tsconfig.json
COPY apps/api/src ./src
RUN npx tsc

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY apps/api/package*.json ./
COPY packages/types /packages/types
RUN npm install --omit=dev --no-audit --no-fund

COPY --from=builder /app/dist ./dist

EXPOSE 8080
CMD ["node", "dist/main.js"]
