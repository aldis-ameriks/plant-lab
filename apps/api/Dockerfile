FROM node:19-alpine3.17 as builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . ./
RUN npm run build

FROM node:19-alpine3.17
WORKDIR /app
ENV NODE_ENV=production
ENV NODE_OPTIONS=--max-old-space-size=256

COPY --from=builder --chown=node:node /app/build /app/build
COPY --from=builder --chown=node:node /app/migrations /app/build/migrations
COPY --from=builder --chown=node:node /app/package.json /app
COPY --from=builder --chown=node:node /app/package-lock.json /app

RUN npm ci --only=production && npm cache clean --force
USER node

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=3s CMD wget --quiet --tries=1 --spider http://127.0.0.1:4000/ping || exit 1

CMD ["node", "build/src/index.js"]
