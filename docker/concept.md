### 什么是Docker
- 使用最广泛的开源容器引擎
- 一种操作系统的虚拟化技术
- 依赖于Linux内核特性：Namespace和Cgroups
- 一个简单的应用程序打包工具
### Docker的设计目标
- 提供简单的应用程序打包工具
- 开发人员和运维人员职责逻辑分离
- 多环境保持一致性
### Docker基本组成
- Docker Client：客户端
- Docker Daemon：守护进程
- Docker Images：镜像
- Docker Container：容器
- Docker Registry：镜像仓库
![image](https://upload-images.jianshu.io/upload_images/8938649-d068e17168661231.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/979/format/webp)
#### 容器vs虚拟机
![image1](https://upload-images.jianshu.io/upload_images/8938649-70556efb240253fe.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/914/format/webp)
![image3](https://upload-images.jianshu.io/upload_images/8938649-1a3175f770f74776.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1000/format/webp)
### Docker应用场景
- 应用程序打包和发布
- 应用程序隔离
- 持续集成
- 部署微服务
- 快速搭建测试环境
- 提供PaaS产品（平台即服务）