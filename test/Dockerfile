#FROM node:9.11.1
#FROM openjdk:8-jdk-alpine
FROM openjdk:8-jre@sha256:143e37a40011243684acf5e0cca99db04cf2675dae54aefcc464d616916dd27b
MAINTAINER sakitam-fdd <smilefdd@gmail.com>

ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV
ENV PROJECT_ENV production
ARG REFRESHED_AT
ENV REFRESHED_AT $REFRESHED_AT

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update -qq && apt-get install -qq --no-install-recommends \
  nodejs \
  yarn \
  && rm -rf /var/lib/apt/lists/*

# Set a working directory
WORKDIR /usr/src/app

# Define commonly used JAVA_HOME variable
#ENV JAVA_HOME /usr/lib/jvm/java-8-oracle

# Install Node.js dependencies
COPY package.json yarn.lock ./
RUN npm install --production

# 把其他源文件复制到工作目录
COPY . .
RUN npm run build

EXPOSE 80

# 这里根据实际起动命令做修改
CMD [ "npm", "prd:server", "java", "-version" ]
