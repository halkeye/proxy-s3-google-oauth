FROM node:6.4.0
MAINTAINER Gavin Mogan <docker@gavinmogan.com>
EXPOSE 3000

ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /usr/src/app && cp -a /tmp/node_modules /usr/src/app

WORKDIR /usr/src/app
COPY . /usr/src/app/
RUN npm install --only=production
#RUN npm install --only=dev
#RUN npm test
#RUN npm prune --production
CMD npm run start

