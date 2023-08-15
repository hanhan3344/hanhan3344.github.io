---
title: 部署code-server让你在iPad上使用VScode
date: 2022-12-07 00:58:55
tags: [云服务器, code-server]
top_img: https://images.weserv.nl/?url=https://article.biliimg.com/bfs/article/dd3cd1e566b75ad5d6622b7c67229988b12a2060.jpg&default=https://article.biliimg.com/bfs/article/dd3cd1e566b75ad5d6622b7c67229988b12a2060.jpg
cover: https://images.weserv.nl/?url=https://hanhan3344-tx-bk-1313563340.cos.ap-guangzhou.myqcloud.com/typora/image-20221207014215268.png&default=https://hanhan3344-tx-bk-1313563340.cos.ap-guangzhou.myqcloud.com/typora/image-20221207014215268.png
---

> 所需材料: 一个可用的云服务器, iPad(任何能使用浏览器的电子设备)

# 在服务器部署code-server

1. 以亚马逊aws免费服务器为例 (能白嫖为什么要花钱呢), 首先新建一个实例, 系统选择ubuntu

   ![image-20221207010335588](https://hanhan3344-tx-bk-1313563340.cos.ap-guangzhou.myqcloud.com/typora/image-20221207010335588.png)

   全部选择免费的即可

   ![image-20221207010436495](https://hanhan3344-tx-bk-1313563340.cos.ap-guangzhou.myqcloud.com/typora/image-20221207010436495.png)

2. 密钥对选项中, 如果没有密钥则点击创建新的密钥对, 记得保存密钥对文件. 创建完后选择新创建的密钥对. 

   ![image-20221207010623627](https://hanhan3344-tx-bk-1313563340.cos.ap-guangzhou.myqcloud.com/typora/image-20221207010623627.png)

3. 网络设置先跳过, 后面在搞. 

4. 配置存储可以拉到30g(免费额度)

   ![image-20221207010725899](https://hanhan3344-tx-bk-1313563340.cos.ap-guangzhou.myqcloud.com/typora/image-20221207010725899.png)

5. 然后点击右下角启动示例即可

   ![image-20221207010758887](https://hanhan3344-tx-bk-1313563340.cos.ap-guangzhou.myqcloud.com/typora/image-20221207010758887.png)

6. 返回实例界面, 等待实例状态变为正在运行

   ![image-20221207010842108](https://hanhan3344-tx-bk-1313563340.cos.ap-guangzhou.myqcloud.com/typora/image-20221207010842108.png)

7. 选择该实例, 点击右上角的 连接 

   ![image-20221207010940039](https://hanhan3344-tx-bk-1313563340.cos.ap-guangzhou.myqcloud.com/typora/image-20221207010940039.png)

8. 用户名使用默认的"ubuntu"即可, 然后点击连接

   ![image-20221207011016491](https://hanhan3344-tx-bk-1313563340.cos.ap-guangzhou.myqcloud.com/typora/image-20221207011016491.png)

9. 连接成功后, 首先设置root密码

   ```bash
   sudo passwd root
   ```

   设置服务器ssh允许密码连接

   ```bash
   sudo vim /etc/ssh/sshd_config 
   ```

   把PermitRootLogin 改为 yes

   ![image-20221207012222270](https://hanhan3344-tx-bk-1313563340.cos.ap-guangzhou.myqcloud.com/typora/image-20221207012222270.png)

   把PasswdAuthentication 改为 yes

   ![image-20221207012343695](https://hanhan3344-tx-bk-1313563340.cos.ap-guangzhou.myqcloud.com/typora/image-20221207012343695.png)

   保存退出

   ![image-20221207012359085](https://hanhan3344-tx-bk-1313563340.cos.ap-guangzhou.myqcloud.com/typora/image-20221207012359085.png)

10. 重启ssh服务

    ```bash
    sudo service ssh restart
    ```

    

11. 设置其安全组, 点击该实例, 在安全选项中, 点击安全组

    ![image-20221207011243835](https://hanhan3344-tx-bk-1313563340.cos.ap-guangzhou.myqcloud.com/typora/image-20221207011243835.png)

12. 点击编辑入站规则

    ![image-20221207011342082](https://hanhan3344-tx-bk-1313563340.cos.ap-guangzhou.myqcloud.com/typora/image-20221207011342082.png)

    然后按照如下配置即可

    ![image-20221207011407437](https://hanhan3344-tx-bk-1313563340.cos.ap-guangzhou.myqcloud.com/typora/image-20221207011407437.png)

    配置完成后点击保存规则. 

13. 现在可以试试能否ping通你的服务器公网ip

    ![image-20221207014404931](https://hanhan3344-tx-bk-1313563340.cos.ap-guangzhou.myqcloud.com/typora/image-20221207014404931.png)

    可以看出已经ping通了

14. 现在你可以用你的任意ssh工具连接上服务器了, 这里用tabby举例

    ![image-20221207014543910](https://hanhan3344-tx-bk-1313563340.cos.ap-guangzhou.myqcloud.com/typora/image-20221207014543910.png)

14. 然后你就可以在这里部署你的code-server了, 首先切换到root用户

    ```bash
    su - root
    ```

    运行一键安装脚本

    ```bash
    curl -fsSL https://code-server.dev/install.sh | sh
    ```

    安装成功后使用以下命令来启动code-server

    ```bash
    export PASSWORD="123456" && code-server --port 8888 --host 0.0.0.0
    ```

    > 注意这里的 --port 8888已经在设置安全组时开启, 不然后面会无法连接.  

    ![image-20221207013721614](https://hanhan3344-tx-bk-1313563340.cos.ap-guangzhou.myqcloud.com/typora/image-20221207013721614.png)

    如图, code-server已启动成功

# 使用iPad连接code-server

15. 打开你的iPad(或者其他任意可使用浏览器的设备), 打开safari转到 http://你的公网ip:8888 , 进入该页面则说明已经连接成功. 

    ![image-20221207014042210](https://hanhan3344-tx-bk-1313563340.cos.ap-guangzhou.myqcloud.com/typora/image-20221207014042210.png)

16. 输入第14步设置的PASSWORD即可进入主界面

    ![image-20221207014215268](https://hanhan3344-tx-bk-1313563340.cos.ap-guangzhou.myqcloud.com/typora/image-20221207014215268.png)

    可以像电脑vscode一样安装插件, 极大的解决了iPad coding难的问题. 
