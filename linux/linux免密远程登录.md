1. 生成密钥对
  - ssh-keygen -t rsa -C "你自己的名字" -f "你自己的名字_rsa"
2. 上传配置公钥
  - 上传公钥到服务器对应账号的home路径下的.ssh/中 （ ssh-copy-id -i "公钥文件名" 用户名@服务器ip或域名 ）
  - 配置公钥文件访问权限为 600 
3. 配置本地私钥 
  - 把第一步生成的私钥复制到你的home目录下的.ssh/ 路径下
  - 配置你的私钥文件访问权限为 600
  - chmod 600 你的私钥文件名 
4. 免密登陆功能的本地配置文件
  - 编辑自己home目录的.ssh/ 路径下的config文件 
  - 配置config文件的访问权限为 644

```bash
# 多主机配置
Host gateway-produce
HostName IP或绑定的域名
Port 22
Host node-produce
HostName IP或绑定的域名
Port 22
Host java-produce
HostName IP或绑定的域名
Port 22

Host *-produce
User root
IdentityFile ~/.ssh/produce_key_rsa
Protocol 2
Compression yes
ServerAliveInterval 60
ServerAliveCountMax 20
LogLevel INFO

#单主机配置
Host #{主机名称}
User #{登录的用户名}
HostName #{IP或绑定的域名}
IdentityFile #{本地公钥文件路径}
Protocol 2
Compression yes
ServerAliveInterval 60
ServerAliveCountMax 20
LogLevel INFO
```