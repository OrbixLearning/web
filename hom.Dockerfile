FROM nginx:latest

ARG CONFIG=hom

COPY /dist/web /usr/share/nginx/html

COPY /nginx.conf /etc/nginx/conf.d/default.conf
