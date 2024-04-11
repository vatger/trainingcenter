FROM node:alpine as build

WORKDIR /build
COPY package*.json ./
RUN npm install && npm install typescript -g
COPY . .
RUN npm run frontend:build


FROM nginx:alpine

WORKDIR /opt

COPY package*.json ./

RUN apk update && apk add --update nodejs npm
RUN npm install --quiet --unsafe-perm --no-progress --no-audit

COPY --from=build /build/_build/frontend /opt/

COPY .docker/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
STOPSIGNAL SIGQUIT

CMD ["nginx", "-g", "daemon off;"]