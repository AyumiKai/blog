#### 文件类型与权限管理
##### 文件类型
打开终端输入以下命令
```bash
ls -l
```
终端输出的内容如下
![image](https://user-gold-cdn.xitu.io/2019/1/23/16878e2679f7e8f8?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)
对每一行的第一列进行下分析
- 第一位字符：文件类型信息，-代表这是一个常规文件--Regular file，d代表这是一个文件夹--Directory，l代表文件链接--Symbolic link，更多文件类型(p-Named pipe、s-Socket、b/c-Device file、D-Door)
- 第2-10位，这九位字符每三个为一组，每组的三个字符分别代表读(r)、写(w)、执行(x)权限，三组分别代表不同所有者对该文件的权限，第一组：文件所有者的权限、第二组：这一组其他用户的权限、第三组：非本组用户的权限

![image1](https://user-gold-cdn.xitu.io/2019/1/23/16878dd01879f1d6?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)
##### 文件权限的修改
一张图看懂修改文件权限的命令
![image2](https://user-gold-cdn.xitu.io/2019/1/23/1687a446f2bd8e5e?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)
通过按位与的设计巧妙的用三个二进制位表示了三种权限产生的8种组合。
用符号改变权限时，如：chmod a+r XX.file表示对用户、组、其他 全部添加读取权限。