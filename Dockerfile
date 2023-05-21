#######################
# Base Image
#######################
FROM node:alpine

WORKDIR /opt/trainingcenter_backend

ARG NODE_ENV=development

COPY package*.json ./

RUN npm install --quiet --unsafe-perm --no-progress --no-audit --include=dev

COPY . .

CMD npm run dev