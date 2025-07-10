FROM nginx:latest

COPY /dist/web /usr/share/nginx/html

COPY /nginx.conf /etc/nginx/conf.d/default.conf
