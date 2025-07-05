FROM node:latest AS builder

WORKDIR /app

COPY package.json .
COPY package-lock.json .
RUN npm install

COPY . .
RUN ["npm", "run", "build", "--configuration=doc"]

FROM nginx:latest

COPY --from=builder /app/dist/web /usr/share/nginx/html

COPY ../devops/nginx.conf /etc/nginx/conf.d/default.conf
