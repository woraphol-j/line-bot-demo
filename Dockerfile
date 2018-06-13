FROM node:8.11.1

LABEL MAINTAINER  Woraphol Janekittanpaiboon <woraphol@gmail.com>

ARG APP_DIR=/usr/src/app

WORKDIR $APP_DIR

COPY ./package.json $APP_DIR
COPY ./package-lock.json $APP_DIR
RUN npm install
ADD . $APP_DIR

CMD ["npm", "start"]
