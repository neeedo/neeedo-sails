FROM    centos:centos6
MAINTAINER Sascha Feldmann "sascha.feldmann@gmx.de"

# Enable EPEL for Node.js
RUN rpm -Uvh http://download.fedoraproject.org/pub/epel/6/i386/epel-release-6-8.noarch.rpm
# Install Node.js and npm
RUN yum install -y npm
RUN npm install -g npm@latest

# RUN npm install -g sails grunt bower npm-check-updates

RUN npm install

# Expose ports.
EXPOSE 1337
