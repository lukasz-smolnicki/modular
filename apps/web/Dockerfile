FROM node:20-alpine AS deps
WORKDIR /repo
COPY package*.json ./
COPY apps/web/package.json apps/web/package.json
RUN npm ci --no-audit --no-fund

FROM node:20-alpine AS build
WORKDIR /repo
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
COPY --from=deps /repo/node_modules ./node_modules
COPY . .
WORKDIR /repo/apps/web
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=8080
COPY --from=build /repo/apps/web/dist ./dist
EXPOSE 8080
CMD ["npx","--yes","http-server","dist","-p","8080","-a","0.0.0.0","-s"]
