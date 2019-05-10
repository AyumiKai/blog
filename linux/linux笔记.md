### centos7下的node nvm的安装
nvm是node的版本管理工具
- 1.在命令输入下面的命令
  -  ```bash
      curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | bash
      ```
  - 或者
    ```bash
    wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | bash
    ```
- 2.下载完成后加入系统环境
  - ```bash
      source   ~/.bashrc
    ```
- 3.查看 NVM 版本list
  - ```bash
      nvm list-romote
    ```
- 4.安装需要的node版本
  - ```bash
      nvm install  v8.12.0
    ```
- 5.查看当前机器已安装版本号
  - ```bash
      nvm list
    ```
- 6.切换node版本
  - ```bash
      nvm use v8.12.0
    ```
- 7.设置默认的node版本
  - ```bash
      nvm alias default v9.5.0
    ```