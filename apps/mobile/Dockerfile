FROM node:20-alpine AS deps
WORKDIR /repo
COPY package*.json ./
COPY apps/mobile/package.json apps/mobile/package.json
RUN npm install --no-audit --no-fund

FROM node:20-alpine AS build
WORKDIR /repo
ARG EXPO_PUBLIC_API_BASE_URL
ENV EXPO_PUBLIC_API_BASE_URL=$EXPO_PUBLIC_API_BASE_URL
ENV EXPO_NO_TELEMETRY=1
COPY --from=deps /repo/node_modules ./node_modules
COPY . .
WORKDIR /repo/apps/mobile
RUN npx expo export --platform web --output-dir dist --clear

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080
COPY --from=build /repo/apps/mobile/dist ./dist
EXPOSE 8080
CMD ["npx","--yes","http-server","dist","-p","8080","-a","0.0.0.0","-s"]
