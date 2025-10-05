FROM node:20-alpine

WORKDIR /repo
COPY . .

RUN npm install --no-audit --no-fund
RUN npx tsc -p apps/api/tsconfig.json

ENV NODE_ENV=production
ENV PORT=8080
CMD ["node","apps/api/dist/main.js"]
