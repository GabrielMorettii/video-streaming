FROM node:16.0-alpine as builder

WORKDIR /app

COPY ./package.json .

RUN npm install

COPY . .

RUN npm run build


FROM nginx

EXPOSE 80

COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html
