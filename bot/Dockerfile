FROM node:8

MAINTAINER Chapman@Apextion.com

# Replace shell with bash so we can source files
RUN rm /bin/sh && ln -sf /bin/bash /bin/sh

ADD ./ /usr/src/app
WORKDIR /usr/src/app

#

RUN npm install -g pm2

RUN npm install
