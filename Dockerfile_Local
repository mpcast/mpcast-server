# 使用DaoCloud的Ubuntu镜像
FROM daocloud.io/library/ubuntu:14.04
# 设置镜像作者
MAINTAINER Fundebug <baisheng@gmail.com>
# 设置时区
RUN sudo sh -c "echo 'Asia/Shanghai' > /etc/timezone" && \
    sudo dpkg-reconfigure -f noninteractive tzdata
# 使用阿里云的Ubuntu镜像
RUN echo '\n\
deb http://mirrors.aliyuncs.com/ubuntu/ trusty main restricted universe multiverse\n\
deb http://mirrors.aliyuncs.com/ubuntu/ trusty-security main restricted universe multiverse\n\
deb http://mirrors.aliyuncs.com/ubuntu/ trusty-updates main restricted universe multiverse\n\
deb http://mirrors.aliyuncs.com/ubuntu/ trusty-proposed main restricted universe multiverse\n\
deb http://mirrors.aliyuncs.com/ubuntu/ trusty-backports main restricted universe multiverse\n\
deb-src http://mirrors.aliyuncs.com/ubuntu/ trusty main restricted universe multiverse\n\
deb-src http://mirrors.aliyuncs.com/ubuntu/ trusty-security main restricted universe multiverse\n\
deb-src http://mirrors.aliyuncs.com/ubuntu/ trusty-updates main restricted universe multiverse\n\
deb-src http://mirrors.aliyuncs.com/ubuntu/ trusty-proposed main restricted universe multiverse\n\
deb-src http://mirrors.aliyuncs.com/ubuntu/ trusty-backports main restricted universe multiverse\n'\
> /etc/apt/sources.list
# 安装node v6.10.1
RUN sudo apt-get update && sudo apt-get install -y wget
# 使用淘宝镜像安装Node.js v8.4.0
RUN wget https://npm.taobao.org/mirrors/node/v8.4.0/node-v8.4.0-linux-x64.tar.gz && \
    tar -C /usr/local --strip-components 1 -xzf node-v8.4.0-linux-x64.tar.gz && \
    rm node-v8.4.0-linux-x64.tar.gz
RUN mkdir -p /app
WORKDIR /app
# 安装npm模块
ADD package.json /app/package.json
# 使用淘宝的npm镜像
RUN npm install --production -d --registry=https://registry.npm.taobao.org
# 添加源代码
ADD . /app
# 运行app.js
CMD ["node", "/app/production.js"]
