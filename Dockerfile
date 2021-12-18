FROM node:17-alpine
RUN apk add chromium
RUN npm install -g resume-cli
