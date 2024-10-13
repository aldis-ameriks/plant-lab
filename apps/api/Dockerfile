FROM node:22-alpine3.19
WORKDIR /app
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=256"

COPY . ./

RUN npm ci --only=production && npm cache clean --force
USER node

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=3s CMD wget --quiet --tries=1 --spider http://127.0.0.1:4000/ping || exit 1

CMD ["node", "--experimental-strip-types", "--no-warnings=ExperimentalWarning", "src/index.ts"]
