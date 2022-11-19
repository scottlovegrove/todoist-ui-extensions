FROM node:18-alpine AS BUILD_IMAGE

# https://medium.com/trendyol-tech/how-we-reduce-node-docker-image-size-in-3-steps-ff2762b51d5a

WORKDIR /usr/src/app

COPY . .
COPY ./prod.env ./.env

RUN npm config set cache /tmp --global

# The rimraf node_modules is run before npm ci as otherwise NPM throws a WARN about it

RUN npm install rimraf -g && \
    npm ci && \
    npm run build \
    rimraf ['node_modules']

# Install dependencies for production
RUN npm ci --omit=dev

FROM node:18-alpine AS RUNTIME
RUN apk add --no-cache curl

WORKDIR /usr/src/app

COPY --from=BUILD_IMAGE /usr/src/app/ ./

EXPOSE 3000
EXPOSE 8080

WORKDIR /usr/src/app
CMD ["npm", "run", "start:prod"]