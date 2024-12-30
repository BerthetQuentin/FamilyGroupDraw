FROM node:18 AS builder
WORKDIR /app
COPY ./app /app

FROM nginx:alpine
COPY --from=builder /app /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 1897

CMD ["nginx", "-g", "daemon off;"]
