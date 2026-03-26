FROM node:22-alpine AS base

WORKDIR /app

COPY package.json yarn.lock ./

FROM base AS deps

RUN yarn install --frozen-lockfile

FROM base AS prod-deps

RUN yarn install --frozen-lockfile --production

FROM deps AS build

COPY . .

RUN yarn build

FROM base AS final

ENV NODE_ENV=production

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

EXPOSE ${APP_PORT:-8080}

CMD ["node", "dist/main"]
