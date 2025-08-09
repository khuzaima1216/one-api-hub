# syntax=docker/dockerfile:1.7

ARG NODE_VERSION=22.9.0

FROM node:${NODE_VERSION}-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

FROM deps AS build
WORKDIR /app
COPY . .
RUN --mount=type=cache,target=/root/.npm npm run build
RUN npm prune --omit=dev

FROM node:${NODE_VERSION}-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    PORT=8000 \
    LOG_LEVEL=info \
    DB_PATH=/data/data.db

# 创建非 root 用户与可写目录
RUN addgroup -g 1001 -S nodejs && adduser -S app -u 1001 \
  && mkdir -p /app/logs /data \
  && chown -R app:nodejs /app /data

# 仅拷贝运行所需内容
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

USER app
EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=5 \
  CMD node -e "fetch('http://127.0.0.1:'+process.env.PORT+'/api/health').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"

# 直接用 node 启动，避免 npm 额外开销
CMD ["node", "dist/server/index.js"]

