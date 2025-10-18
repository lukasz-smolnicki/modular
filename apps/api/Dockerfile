FROM node:20-alpine AS builder
WORKDIR /app

COPY apps/api/package*.json ./apps/api/
COPY packages/types ./packages/types
RUN cd apps/api && npm install --no-audit --no-fund
RUN npm i -g typescript@5.9.3

COPY tsconfig.json ./tsconfig.json
COPY apps/api/tsconfig.json ./apps/api/tsconfig.json
COPY apps/api/src ./apps/api/src
RUN tsc -p apps/api/tsconfig.json

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY apps/api/package*.json ./apps/api/
RUN cd apps/api && npm install --omit=dev --no-audit --no-fund
COPY --from=builder /app/apps/api/dist ./apps/api/dist

EXPOSE 8080
CMD ["node", "apps/api/dist/main.js"]
