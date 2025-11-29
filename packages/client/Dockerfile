FROM node:22-alpine AS development-dependencies-env
COPY package.json package-lock.json /app/
COPY packages/client/package.json /app/packages/client/
COPY packages/server/package.json /app/packages/server/
WORKDIR /app
RUN npm ci

FROM node:22-alpine AS production-dependencies-env
COPY package.json package-lock.json /app/
COPY packages/client/package.json /app/packages/client/
COPY packages/server/package.json /app/packages/server/
WORKDIR /app
RUN npm pkg delete scripts.prepare && npm ci --omit=dev

FROM node:22-alpine AS build-env
COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app/packages/client
RUN npm run build

FROM node:22-alpine
COPY package.json package-lock.json /app/
COPY --from=production-dependencies-env /app/node_modules /app/node_modules
COPY --from=production-dependencies-env /app/packages /app/packages
COPY --from=build-env /app/packages/client/build /app/packages/client/build
WORKDIR /app/packages/client
CMD ["npm", "run", "start"]