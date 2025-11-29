FROM node:22-alpine AS development-dependencies-env
COPY package.json package-lock.json /app/
COPY packages/server/package.json /app/packages/server/
WORKDIR /app
RUN npm ci

FROM node:22-alpine AS production-dependencies-env
COPY package.json package-lock.json /app/
COPY packages/server/package.json /app/packages/server/
WORKDIR /app
RUN npm pkg delete scripts.prepare && npm ci --omit=dev

FROM node:22-alpine AS build-env
COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app/packages/server
RUN npm run build

FROM node:22-alpine
COPY package.json package-lock.json /app/
COPY packages/server/package.json /app/packages/server/
COPY --from=production-dependencies-env /app/node_modules /app/node_modules
COPY --from=build-env /app/packages/server/dist /app/packages/server/dist
WORKDIR /app/packages/server
CMD ["npm", "run", "start"]
