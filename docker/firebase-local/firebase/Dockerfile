FROM node:20-alpine

WORKDIR /firebase

RUN apk add --no-cache openjdk17-jre

RUN npm install -g firebase-tools

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]