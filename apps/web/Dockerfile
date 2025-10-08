FROM node:20-alpine AS builder
WORKDIR /app

COPY apps/web/package*.json ./
RUN npm install --no-audit --no-fund

COPY apps/web/tsconfig.json ./tsconfig.json
COPY apps/web/vite.config.ts ./vite.config.ts
COPY apps/web/index.html ./index.html
# usuwamy COPY public – katalogu może nie być
COPY apps/web/src ./src

ARG API_URL=""
ENV VITE_API_BASE_URL=$API_URL
ENV CI=1

RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /srv
RUN npm i -g serve
COPY --from=builder /app/dist ./dist
ENV PORT=8080
EXPOSE 8080
CMD ["serve", "-s", "dist", "-l", "8080"]
