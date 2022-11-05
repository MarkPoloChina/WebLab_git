# 机器学习研究室门户项目“ML-Lab Website” 《构成、部署和维护手册》

## 模块构成

本项目是为福州大学计算机与大数据学院机器学习研究室(Lab of Vision and Machine Learning)开发的门户网站。

网站包含以下功能模块：

- Home：用于展示实验室简介、要闻、老师介绍、项目简介等基本信息。
- Publications：用于展示已发布（公开）论文及未发布（不公开）论文的标题、作者、摘要、录用信息等内容，并提供代码和PDF文档链接。其中不公开论文仅登录用户可查看。
- Resource：用于展示各种资源链接。
- Schedule：用于添加、查看个人待办事项。其中普通用户可添加、修改、查看和删除自己的待办，而管理员用户可查看全部成员的待办信息，并可以通过搜索成员用户名和姓名来筛选。
- Admin：仅管理员可见。用于上传和修改Publication、Resource和Home的信息。同时可以添加用户、修改用户、重置用户密码等。

网站用户组包含：

- admin：管理员。
- user：普通用户。

某用户属于何用户组由管理员控制。

## 系统构成

- 前端。基于Vue、Vite构建。
- 后端，基于Docker、GoHTTP、MySQL、MinIO等构建。
  - API，提供基本接口
  - MySQL，提供基础数据库
  - MinIO-Client，提供MinIO接口
  - MinIO，提供文件数据库
  - Redis，提供包含Token和Config等的数据库

两个子系统需要分别部署。

## 部署方法

### 前端部署

#### 修改配置文件

[前端仓库地址](https://github.com/MarkPoloChina/WebLab_git.git)

配置文件位于`./src/api/config.js`，详细字段见注释。

#### 构建

需要安装下载`NodeJs@16`，[下载链接](http://nodejs.cn/download/)，请选择16.x版本。

在源码目录下：

```bash
npm install
npm run build
```

获得的`./dist`为打包后文件。

#### 服务器部署

推荐使用`Nginx`，并注意修改Nginx的conf配置后要reload。

将`./dist`上传到服务器某目录，如`/www/wwwroot/dist`。

在配置文件中，需要添加下述`location`。

```
server
{
    listen 80;
    # ...
    location / {
      root /www/wwwroot/dist;
      try_files $uri $uri/ /index.html;
    }
    # ....
}
```

#### 托管部署

可以将本前端项目直接放置在静态托管环境中访问，比如github.io和腾讯云COS静态页面访问。

将上述`./dist`内全部文件上传到托管根目录（不含dist文件夹本身），然后复制其中的index.html为404.html，同样地放置在根目录下。

即，最终托管根目录结构为：

- assets
- index.html
- 404.html

#### 使用域名的部署（可选）

如果是使用托管部署，比如github.io和腾讯云COS静态页面访问，那么一般来说平台都提供了相应的域名解析和SSL服务，无须额外配置，直接使用形如`https://domain...`即可访问。

如果是使用服务器部署，并且想使用域名解析服务和Https访问，需要：

1. 申请域名
2. 为域名申请网站备案（仅中国大陆域名提供商需要）
3. 为域名申请SSL证书
4. 为域名添加指向服务器的A类型解析
5. 在服务器Nginx配置中添加或修改为：

```
server
{
    listen 443 ssl;
    server_name domain.cn; #修改成你的域名
    index index.php index.html index.htm default.php default.htm default.html;
    root /www/wwwroot/dist;

    #SSL-START SSL相关配置，请勿删除或修改下一行带注释的404规则
    #error_page 404/404.html;
    ssl_certificate    /www/ssl/ssl_certificate.pem; #修改成你的SSL证书路径
    ssl_certificate_key    /www/ssl/ssl_certificate_key.pem; #修改成你的SSL密钥路径
    ssl_protocols TLSv1.1 TLSv1.2 TLSv1.3;
    ssl_ciphers EECDH+CHACHA20:EECDH+CHACHA20-draft:EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    add_header Strict-Transport-Security "max-age=31536000";
    location / {
      try_files $uri $uri/ /index.html;
    }
    # ....
}
```

其中`server_name` `ssl_certificate` `ssl_certificate_key`需要修改为实际内容。

如果只想使用域名解析，而不使用Https，则无须申请证书，且配置为：

```
server
{
    listen 80;
    server_name domain.cn; #修改成你的域名
    index index.php index.html index.htm default.php default.htm default.html;
    root /www/wwwroot/dist;
    #...
    
    location / {
      try_files $uri $uri/ /index.html;
    }
    # ....
}
```

### 后端部署

[后端仓库地址](https://github.com/RockRockWhite/LabWeb-backend-docker)

#### 安装Docker

需要在服务器端安装docker和docker compose，[安装教程](https://www.runoob.com/docker/centos-docker-install.html)

#### 修改配置文件

由于使用子模块，不能直接下载源码来构建。请按照仓库下README来构建和运行。

在服务器某目录：

```bash
git clone --recursive https://github.com/RockRockWhite/LabWeb-backend-docker.git
cd ./LabWeb-backend-docker
cp config.yml ./minio-client/config/config.yml
```

特别地，如果在服务器上git无法访问，可以现在本地拉取，再上传到服务器。

文件储存库、API和容器配置分别在

`./minio-client/config/config.yml`

`./LabWeb.API/config/config.yml`

`./docker-compose.yml`

详细字段见注释。

默认端口如下：

- MinIO的客户机端口。默认为9001。
- API主端口，默认8080。

**需要注意，API和MinIO的端口号都需要与前端配置中的一致。**

#### 构建和运行

在源码目录下，

```bash
docker compose build --no-cache
docker compose up -d
```

#### 开放端口

在开启防火墙的服务器，必须开放MinIO客户机和API的TCP端口。

同时，如果服务器提供商有额外安全组的，也需要开放对应TCP端口。

#### 使用域名的部署（可选）

如果前端页面的部署是托管部署，比如github.io和腾讯云COS静态页面访问，且事实上使用了Https访问，或者使用服务器部署且基于使用了SSL证书的Https方法，那么下述操作是必须的。

1. 申请域名（可以使用前文中前端的域名，并跳过2-4步）
2. 为域名申请网站备案（仅中国大陆域名提供商需要）
3. 为域名申请SSL证书
4. 为域名添加指向服务器的A类型解析
5. 在服务器Nginx配置中添加server为：

```
server
{
    listen 8081 ssl; #需要与实际的API主端口号不一致，推荐为API主端口号+1
    server_name domain.cn; #修改成你的域名
    #SSL-START SSL相关配置，请勿删除或修改下一行带注释的404规则
    #error_page 404/404.html;
    ssl_certificate    /www/ssl/ssl_certificate.pem; #修改成你的SSL证书路径
    ssl_certificate_key    /www/ssl/ssl_certificate_key.pem; #修改成你的SSL密钥路径
    ssl_protocols TLSv1.1 TLSv1.2 TLSv1.3;
    ssl_ciphers EECDH+CHACHA20:EECDH+CHACHA20-draft:EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    add_header Strict-Transport-Security "max-age=31536000";
    location / {
      proxy_pass http://localhost:8080; #端口号改为实际的API主端口号，默认为8080
      proxy_set_header Host localhost;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header REMOTE-HOST $remote_addr;

      add_header X-Cache $upstream_cache_status;
    }
    # ....
}
server
{
    listen 9002 ssl; #需要与实际的MinIO客户机端口号不一致，推荐为API主端口号+1
    server_name domain.cn; #修改成你的域名
    #SSL-START SSL相关配置，请勿删除或修改下一行带注释的404规则
    #error_page 404/404.html;
    ssl_certificate    /www/ssl/ssl_certificate.pem; #修改成你的SSL证书路径
    ssl_certificate_key    /www/ssl/ssl_certificate_key.pem; #修改成你的SSL密钥路径
    ssl_protocols TLSv1.1 TLSv1.2 TLSv1.3;
    ssl_ciphers EECDH+CHACHA20:EECDH+CHACHA20-draft:EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    add_header Strict-Transport-Security "max-age=31536000";
    location / {
      proxy_pass http://localhost:9001; #端口号改为实际的MinIO客户机端口号，默认为9001
      proxy_set_header Host localhost;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header REMOTE-HOST $remote_addr;

      add_header X-Cache $upstream_cache_status;
    }
    # ....
}
```

6. 前端配置中url修改为形如`https://domain.cn:8081`和`https://domain.cn:9002`。注意端口号与Nginx中listen的端口号一致。

## 维护

详见各源码仓库下README。

---------

© 2022 Lab of Vision and Machine Learning, College of Computer and Data Science, Fuzhou University.

© 2022 SOSD, Fuzhou University.
