FROM node:alpine as build

WORKDIR /build
COPY package*.json ./
RUN npm install && npm install typescript -g
COPY . .
RUN npm run all:build


FROM nginx:alpine

WORKDIR /opt

COPY package*.json ./

RUN apk update && apk add --update nodejs npm
RUN npm install --quiet --unsafe-perm --no-progress --no-audit

COPY --from=build /build/_build/ /opt/

COPY .docker/default.conf /etc/nginx/conf.d/default.conf

# Init cron
ADD .docker/entry.sh /entry.sh
RUN chmod 755 /entry.sh

RUN mkdir -p /opt/backend/log

EXPOSE 80

CMD ["sh", "/entry.sh"]