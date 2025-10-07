FROM node:20-alpine AS builder
WORKDIR /repo

COPY package*.json ./
RUN npm install --no-audit --no-fund

COPY tsconfig.json ./tsconfig.json
COPY src ./src

ARG API_URL
ENV EXPO_PUBLIC_API_BASE_URL=$API_URL

RUN npx expo export --platform web

FROM node:20-alpine AS runner
WORKDIR /app
RUN npm i -g serve
COPY --from=builder /repo/dist ./dist
ENV PORT=8080
EXPOSE 8080
CMD ["serve", "-s", "dist", "-l", "8080"]
