FROM node:20-alpine

WORKDIR /

RUN apk add --no-cache openjdk17-jre

RUN npm install -g firebase-tools

COPY . .

CMD ["node", "/entrypoint.js"]
