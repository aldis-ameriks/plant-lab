FROM node:alpine as builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . ./
RUN yarn build

FROM node:alpine
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder --chown=node:node /app/build /app/build
COPY --from=builder --chown=node:node /app/package.json /app
COPY --from=builder --chown=node:node /app/yarn.lock /app

RUN mkdir /app/config
RUN touch /app/config/production.json
RUN echo "{}" >> /app/config/production.json

RUN yarn install --frozen-lockfile --production
USER node

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=3s CMD wget --quiet --tries=1 --spider http://127.0.0.1:4000/ping || exit 1

CMD ["yarn", "start"]
