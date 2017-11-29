FROM node:8.8.1

MAINTAINER Chapman@Apextion.com

# Replace shell with bash so we can source files
# RUN rm /bin/sh && ln -sf /bin/bash /bin/sh

WORKDIR /var/app
COPY package.json .

RUN npm install

# Global Installs
RUN npm install -g pm2 sequelize-cli gulp-cli

COPY . .
