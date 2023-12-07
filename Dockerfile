#######################
# Base Image
#######################
FROM node:alpine

WORKDIR /opt/trainingcenter_backend

ARG NODE_ENV=development

COPY package*.json ./

RUN npm install --quiet --unsafe-perm --no-progress --no-audit --include=dev

COPY . .

# Init cron
ADD misc/crontab.txt /crontab.txt
ADD entry.sh /entry.sh
RUN chmod 755 /entry.sh
RUN /usr/bin/crontab /crontab.txt

RUN npm run build

CMD ["sh", "/entry.sh"]