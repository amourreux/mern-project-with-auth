FROM node:16

WORKDIR /opt/node-server
COPY . .

RUN npm install


