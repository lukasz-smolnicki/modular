FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
COPY tsconfig.json tsconfig.spec.json ./
COPY src ./src
RUN npm ci --no-audit --no-fund
RUN npx tsc -p tsconfig.json

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund
COPY --from=builder /app/dist ./dist
CMD ["node", "dist/main.js"]
