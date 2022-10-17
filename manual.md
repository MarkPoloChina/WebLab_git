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

#### 部署

推荐使用`Nginx`

将`./dist`上传到服务器某目录，如`/www/wwwroot/dist`。

在配置文件中，需要添加下述`location`。

```json
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

文件储存库、API和容器配置分别在

`./minio-client/config/config.yml`

`./LabWeb.API/config/config.yml`

`./docker-compose.yml`

详细字段见注释。

**需要注意，API和MinIO的端口号都需要与前端配置中的一致。**

#### 构建和运行

在源码目录下，

```bash
docker compose build --no-cache
docker compose up -d
```

#### 开放端口

在开启防火墙的服务器，必须开放下述TCP端口：

- MinIO的客户机端口。默认为9001。
- API主端口，默认8080。

同时，如果服务器提供商有额外安全组的，也需要开放对应TCP端口。

## 维护

详见各源码仓库下README。

---------

© 2022 Lab of Vision and Machine Learning, College of Computer and Data Science, Fuzhou University.

© SOSD
