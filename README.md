# API 服务安装
    注意：
    需要 Node 8+、 MySQL5.7+、 Redis、Nginx、PM2 环境的支持，请确保服务器上安装相关环境
    
# 基本运行
## 前置准备
1. 建立数据库服务

    数据库文件存放地址
    ```bash
    .res/caixie-picker_v2.zy.sql
    ```  
 
2. 数据库请求配置
    ```bash
    src/common/config/adapter/model.js
    ```  
  
3. 启动 redis

   配置文件在: 
   
   ```bash
   src/common/config/adapter/redis_cache.js
   ```  
        
## 安装依赖

```
yarn or npm install
```

## 运行服务

```
yarn start or npm start
```

## 使用 pm2 部署

```
pm2 startOrReload pm2.json
```

## nginx 配置
    参考工程目录下的 nginx.conf
    
## 使用 Docker 部署
    参考工程目录下的 Dockerfile
    
    
# 工程目录

```bash
.
├── Dockerfile
├── Dockerfile_Local
├── README.md
├── development.js
├── keywords
├── logs
├── nginx.conf
├── package-lock.json
├── package.json
├── pm2.json
├── port
├── production.js
├── runtime
│   └── config
│       └── development.json
├── src
│   ├── admin
│   │   └── controller              # 包含一个定时器用于定期更新 redis 缓存
│   ├── api
│   │   ├── config 
│   │   ├── controller              # Api Controller
│   │   ├── logic
│   │   └── service
│   └── common
│       ├── bootstrap               # 系统启动入口
│       ├── config                  # 系统配置文件目录
│       ├── extend                  
│       ├── model                   # 数据表模型
│       └── service
├── yarn-error.log
└── yarn.lock
```

