# Multi-stage Dockerfile for SmartDustbinSim
# 1) Build frontend with Vite into dist/public
# 2) Bundle server with esbuild into dist
# 3) Run minimal Node.js image

FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --omit=optional

FROM deps AS build
COPY . .
# Build client and server
RUN npm run build

FROM node:20-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./package.json
EXPOSE 5000
ENV PORT=5000
CMD ["node", "dist/index.js"]
