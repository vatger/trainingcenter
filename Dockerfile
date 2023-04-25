#######################
# Base Image
#######################
FROM node:alpine

WORKDIR /app

# Install npm Dependencies
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install -g typescript
RUN npm install

COPY ./ ./
# Compile typescript
RUN tsc

# Explicity delete all unused directores
RUN rm -rf ./src ./misc ./.git > /dev/null
RUN rm * 2> /dev/null || true

# Copy back the package.json for use in program, since we deleted it earlier
COPY ["package.json", "package-lock.json*", "./"]

EXPOSE 8001

CMD ["node", "./dist/index.js"]