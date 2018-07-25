FROM node:8-alpine
MAINTAINER Gavin Mogan <docker@gavinmogan.com>
EXPOSE 3000
WORKDIR /usr/src/app
COPY . /usr/src/app/
RUN NODE_ENV=production npm install
CMD npm run start

