# build: Expo Web
FROM node:20-alpine AS builder
WORKDIR /app

COPY apps/mobile/package*.json ./
RUN npm install --no-audit --no-fund

COPY apps/mobile/tsconfig.json ./tsconfig.json
COPY apps/mobile/src ./src

ARG API_URL
ENV EXPO_PUBLIC_API_BASE_URL=$API_URL
ENV CI=1

RUN npx expo export --platform web

# runtime: serwowanie SPA
FROM node:20-alpine AS runner
WORKDIR /srv
RUN npm i -g serve
COPY --from=builder /app/dist ./dist
ENV PORT=8080
EXPOSE 8080
CMD ["serve", "-s", "dist", "-l", "8080"]
