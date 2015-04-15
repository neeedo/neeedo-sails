FROM debian:7.0
MAINTAINER Sascha Feldmann "sascha.feldmann@gmx.de"

RUN apt-get install curl
RUN curl -sL https://deb.nodesource.com/setup | bash -
RUN apt-get install -y nodejs
RUN npm install -g npm@latest

# RUN npm install -g sails grunt bower npm-check-updates

RUN npm install

# Expose ports.
EXPOSE 1337
