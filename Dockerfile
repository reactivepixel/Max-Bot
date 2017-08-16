FROM node:6
ADD ./ /usr/src/app
WORKDIR /usr/src/app
RUN npm install
