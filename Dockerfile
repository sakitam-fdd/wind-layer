# 安装openjdk
FROM openjdk:8-jdk-slim

# 安装依赖
RUN apt-get update && \
    apt-get install -y gnupg curl jq bsdmainutils git vim tar make g++

# 安装node
RUN set -x \
    && curl -sL https://deb.nodesource.com/setup_10.x | bash - \
    && apt-get install -y \
        nodejs \
    && npm install -g npm@latest yarn@latest

# 输出版本
RUN node -v
RUN npm -v
RUN yarn -v
RUN java -version

# 清空缓存
RUN apt-get clean && \
    rm -rf /var/lib/apt/lists/* /var/tmp/*

# 创建工作目录，对应的是应用代码存放在容器内的路径
WORKDIR /app

COPY package.json *.lock ./

# 只安装dependencies依赖
# node镜像自带yarn
RUN yarn --only=prod --registry=https://registry.npm.taobao.org

# 把其他源文件复制到工作目录
COPY . .

# 替换成应用实际的端口号
#EXPOSE ${app_port}

# 添加源代码
ADD . /app

# 运行app.js
CMD ["node", "/app/server/bin/www"]
