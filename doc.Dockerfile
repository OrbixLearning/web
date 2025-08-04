# Docker context should be above the web directory
# Build command (in ../web): docker build . -f web/Dockerfile -t web

FROM node:latest AS builder

WORKDIR /app

ARG CONFIG=doc

COPY web/package.json .
COPY web/package-lock.json .
RUN npm install

COPY web/public/ public/
COPY web/src/ src/
COPY web/angular.json .
COPY web/tsconfig.json .
COPY web/tsconfig.app.json .
COPY web/tsconfig.spec.json .

RUN npm run build -- --configuration=$CONFIG

FROM nginx:latest

ARG CONFIG=doc

COPY --from=builder /app/dist/web /usr/share/nginx/html

COPY app/devops/$CONFIG/nginx.conf /etc/nginx/conf.d/default.conf
