FROM node:argon

MAINTAINER Hélain Schoonjans helain.schoonjans@b2boost.com

# create app directory
RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY . /usr/src/app/

CMD ["node", "bot"]