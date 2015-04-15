FROM node:slim
MAINTAINER Sascha Feldmann "sascha.feldmann@gmx.de"

RUN apt-get update

RUN apt-get install -y nodejs git openssl
RUN npm install -g npm@latest
RUN npm install -g sails grunt bower npm-check-updates
RUN mkdir /server

# Define mountable directories.
VOLUME ["/server"]

# Define working directory.
WORKDIR /server

# Expose ports.
EXPOSE 1337

# Cleanup
RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
RUN apt-get autoremove -y
