#  ---- Build stage ----

FROM node:22-alpine AS build

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

# Prune dev deps for smaller runtime
RUN yarn install --frozen-lockfile --production && yarn cache clean

#  ---- Runtime stage ----

FROM node:22-alpine AS runtime

ENV NODE_ENV=production
ENV PORT=${PORT:-8080}

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

# ---- Security: run as non-root ----
RUN addgroup -S app && adduser -S app -G app
USER app

EXPOSE ${PORT:-8080}
CMD ["node", "dist/main.js"]
