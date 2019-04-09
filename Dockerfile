FROM mhart/alpine-node:10

# 设置镜像作者
#MAINTAINER baisheng <baisheng@gmail.com>
# 设置时区
RUN sh -c "echo 'Asia/Shanghai' > /etc/timezone"
WORKDIR /app
# 安装npm模块
ADD package.json /app/package.json
# 使用淘宝的npm镜像
RUN npm install --production -d --registry=https://registry.npm.taobao.org
#RUN npm install --production -d

FROM mhart/alpine-node:base-8
WORKDIR /app
COPY --from=0 /app .
# 添加源代码
COPY . .
EXPOSE 5000
CMD ["node", "/app/production.js"]
