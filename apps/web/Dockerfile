FROM node:19-alpine3.17 as builder
WORKDIR /app

ARG NEXT_PUBLIC_API_GRAPHQL_ENDPOINT=https://api.plant.kataldi.com/graphql
ARG NEXT_PUBLIC_API_GRAPHQL_WS_ENDPOINT=wss://api.plant.kataldi.com/graphql
ARG NEXT_PUBLIC_MOCK_GRAPHQL
ARG NEXT_PUBLIC_GA_TRACKING_ID
ARG NEXT_PUBLIC_GTM_ID
ARG NEXT_PUBLIC_API_BASE_URL=https://api.plant.kataldi.com
ARG NEXT_PUBLIC_CAPTURE_ERRORS
ARG NEXT_PUBLIC_COMMIT_HASH

COPY package.json package-lock.json ./
RUN npm ci
COPY . ./

# Necessary to build with node 17
# TODO: Check if still necessary with node 19
ENV NODE_OPTIONS="${NODE_OPTIONS} --openssl-legacy-provider"

RUN touch .env.production \
 && echo "NEXT_PUBLIC_SITE_KEY=$NEXT_PUBLIC_SITE_KEY" >> .env.production \
 && echo "NEXT_PUBLIC_API_GRAPHQL_ENDPOINT=$NEXT_PUBLIC_API_GRAPHQL_ENDPOINT" >> .env.production \
 && echo "NEXT_PUBLIC_API_GRAPHQL_WS_ENDPOINT=$NEXT_PUBLIC_API_GRAPHQL_WS_ENDPOINT" >> .env.production \
 && echo "NEXT_PUBLIC_MOCK_GRAPHQL=$NEXT_PUBLIC_MOCK_GRAPHQL" >> .env.production \
 && echo "NEXT_PUBLIC_GA_TRACKING_ID=$NEXT_PUBLIC_GA_TRACKING_ID" >> .env.production \
 && echo "NEXT_PUBLIC_GTM_ID=$NEXT_PUBLIC_GTM_ID" >> .env.production \
 && echo "NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL" >> .env.production \
 && echo "NEXT_PUBLIC_CAPTURE_ERRORS=$NEXT_PUBLIC_CAPTURE_ERRORS" >> .env.production \
 && echo "NEXT_PUBLIC_COMMIT_HASH=$NEXT_PUBLIC_COMMIT_HASH" >> .env.production \
 && cat .env.production \
 && npm run build

FROM node:19-alpine3.17
WORKDIR /app

ENV NODE_ENV=production
ENV NODE_OPTIONS="${NODE_OPTIONS} --max-old-space-size=128"

COPY --from=builder --chown=node:node /app/.next /app/.next
COPY --from=builder --chown=node:node /app/package.json /app
COPY --from=builder --chown=node:node /app/package-lock.json /app
COPY --from=builder --chown=node:node /app/public /app/public

RUN npm ci --only=production && npm cache clean --force
USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s CMD wget --quiet --tries=1 --spider http://127.0.0.1:3000/api/ping || exit 1

CMD ["node", "./node_modules/.bin/next", "start"]
