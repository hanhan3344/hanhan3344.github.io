---
title: PX4仿真环境的搭建
date: 2022-12-05 21:24:35
tags: 
  - px4
  - ubuntu
  - docker
categories: 
  - 南工御风
top_img: https://images.weserv.nl/?url=https://cdn.jsdelivr.net/gh/hanhan3344/pic/note_pic/elysia05.jpg&default=https://cdn.jsdelivr.net/gh/hanhan3344/pic/note_pic/elysia05.jpg
cover: https://images.weserv.nl/?url=https://cdn.jsdelivr.net/gh/hanhan3344/pic/note_pic/image.png&default=https://cdn.jsdelivr.net/gh/hanhan3344/pic/note_pic/image.png
---

# 通过Docker搭建（比较推荐）

> 优点: 搭建方便, 可以轻松地在windows系统上运行, 开发与调试可以同平台进行
>
> 缺点: 性能损耗大(需要较高性能), gazebo模拟器没有图形化界面(其实无关紧要)
>
> 该教程适用于win11 (我自己的环境), win10自行探索

## 安装Docker Desktop for Windows

### 准备工作

1. 控制面板-程序和功能-启用或关闭Windows功能-勾选【适用于 Linux 的 Windows 子系统】和【虚拟机平台】这两项-立即重新启动；  

### 安装WSL 2和Ubuntu20.04

2. 点击[这里](https://learn.microsoft.com/en-us/windows/wsl/install-manual#step-4---download-the-linux-kernel-update-package)前往微软官方文档Step 4, 下载[WSL2 Linux kernel update package for x64 machines](https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi)内核升级包并安装.  

3. 设置WSL版本为WSL 2. 打开 PowerShell , 输入  

   ```bash
   wsl --set-default-version 2
   ```

   查看可用ubuntu版本  

   ```bash
   wsl --list --online
   ```

   安装  

   ```bash
   wsl --install -d Ubuntu-20.04
   ```

   安装结束后设置你的Ubuntu用户名和密码, 即可关闭这个界面.   

### 安装Docker Desktop

4. [官网下载](https://www.docker.com/get-started/), 然后双击运行安装即可.   

5. 设置里勾选 基于WSL 2的引擎  

   ![image-20221205215205499](https://cdn.jsdelivr.net/gh/hanhan3344/pic/note_pic/image-20221205215205499.png)

6. 在PowerShell中输入  

   ```bash
   wsl -l -v
   ```

   可以发现docker已经在运行  

   ![image-20221205215448505](https://cdn.jsdelivr.net/gh/hanhan3344/pic/note_pic/image-20221205215448505.png)


## 安装PX4仿真镜像

7. 打开Docker Desktop, 并搜索 `px4-gazebo-headless`, 点击Pull拉取镜像.   

   ![image-20221205220006231](https://cdn.jsdelivr.net/gh/hanhan3344/pic/note_pic/image-20221205220006231.png)

8. 拉取成功后, 即可打开Ubuntu20.04, 运行  

   ```bash
   docker run --rm -it jonasvautherin/px4-gazebo-headless:latest -v plane 
   ```

   > 该命令为在Broadcast模式下运行sitl仿真, 并使用固定翼模型. 在此配置中, 容器将 MAVLink 发送到端口 14550（对于 QGC）和 14540（例如 MAVSDK）上的主机.   

   看到如下画面, 即代表px4 SITL仿真已成功启动  

   ![image-20221205220551641](https://cdn.jsdelivr.net/gh/hanhan3344/pic/note_pic/image-20221205220551641.png)

   ![image-20221205220525084](https://cdn.jsdelivr.net/gh/hanhan3344/pic/note_pic/image-20221205220525084.png)

   打开QGC, 飞机即可自动连接  

   ![image-20221205220648562](https://cdn.jsdelivr.net/gh/hanhan3344/pic/note_pic/image-20221205220648562.png)

   终端输入  

   ```bash
   shutdown
   ```

   即可结束仿真  

   ![image-20221205221320196](https://cdn.jsdelivr.net/gh/hanhan3344/pic/note_pic/image-20221205221320196.png)

# 自行搭建（一般推荐）

> 优点: 性能较好, gazebo模拟器有图形化界面(无关紧要), 可以增加Linux基础, 不用docker可以享受自己配环境的乐趣  
>
> 缺点: 费时费力, 有docker为什么还要自己配环境()  
>
> 此教程基于ubuntu20.04 (我的环境), 如果你是ubuntu18.04也可以参考[这里](https://github.com/Nangong-Yufeng/flight-control/blob/main/PX4%E7%9B%B8%E5%85%B3/PX4%E5%AE%89%E8%A3%85%E6%95%99%E7%A8%8B%E4%B8%8E%E5%BC%80%E5%8F%91%E8%BF%9B%E5%BA%A6.md). 或者你想[跟着PX4官方文档搭建环境](https://docs.px4.io/main/zh/dev_setup/dev_env_linux_ubuntu.html#ubuntu-lts-debian-linux-%E7%9A%84%E5%BC%80%E5%8F%91%E7%8E%AF%E5%A2%83)  
>
> 搭建环境时建议使用一个好用的梯子(既然你能看到这个文章说明这应该不是问题)  

## ROS安装

1. 首先安装ROS, 推荐使用[FishRos](https://fishros.org.cn/forum/topic/20/%E5%B0%8F%E9%B1%BC%E7%9A%84%E4%B8%80%E9%94%AE%E5%AE%89%E8%A3%85%E7%B3%BB%E5%88%97?lang=zh-CN)  

   ```bash
   wget http://fishros.com/install -O fishros && . fishros 
   ```

   分别选择1, 3, 4 (配置环境需要用到的)  

   ![image-20221205222351336](https://cdn.jsdelivr.net/gh/hanhan3344/pic/note_pic/image-20221205222351336.png)

## PX4安装

2. 安装依赖

   ```bash
   sudo apt install ninja-build exiftool ninja-build protobuf-compiler libeigen3-dev genromfs xmlstarlet libgstreamer1.0-dev libgstreamer-plugins-base1.0-dev python-pip python3-pip
   ```

   ```bash
   pip3 install pandas jinja2 pyserial cerberus pyulog==0.7.0 numpy toml pyquaternion empy pyyaml 
   ```

   ```bash
   pip3 install packaging numpy empy toml pyyaml jinja2 pyargparse
   ```

3. 创建工作空间

   ```bash
   sudo apt-get install python-catkin-tools
   mkdir -p ~/catkin_ws/src
   mkdir -p ~/catkin_ws/scripts
   cd catkin_ws && catkin init # 使用catkin_make话，则为cd catkin_ws/src && catkin_init_workspace
   ```

4. 安装MAVROS

   ```bash
   sudo apt install ros-noetic-mavros ros-noetic-mavros-extras   
   wget https://gitee.com/robin_shaun/XTDrone/raw/master/sitl_config/mavros/install_geographiclib_datasets.sh
   sudo chmod a+x ./install_geographiclib_datasets.sh
   sudo ./install_geographiclib_datasets.sh #这步需要装一段时间,请耐心等待PX4配置
   ```

5. 安装PX4

   推荐[官方脚本](https://docs.px4.io/main/zh/dev_setup/dev_env_linux_ubuntu.html#%E4%B8%80%E9%94%AE%E5%AE%89%E8%A3%85%E8%84%9A%E6%9C%AC)

   ```bash
   cd ~/catkin_ws
   ```

   ```bash
   git clone https://github.com/PX4/PX4-Autopilot.git --recursive
   ```

   ```bash
   bash ./PX4-Autopilot/Tools/setup/ubuntu.sh
   ```

   然后重启电脑

6. 环境配置

   打开一个终端, 输入

   ```bash
   sudo gedit ~/.bashrc
   ```

   将下面代码粘贴到里面

   ```bash
   source ~/catkin_ws/devel/setup.bash
   source ~/catkin_ws/PX4-Autopilot/Tools/simulation/gazebo/setup_gazebo.bash ~/catkin_ws/PX4-Autopilot/ ~/catkin_ws/PX4-Autopilot/build/px4_sitl_default
   export ROS_PACKAGE_PATH=$ROS_PACKAGE_PATH:~/catkin_ws/PX4-Autopilot
   export ROS_PACKAGE_PATH=$ROS_PACKAGE_PATH:~/catkin_ws/PX4-Autopilot/Tools/simulation/gazebo/sitl_gazebo
   ```

   保存退出后输入

   ```bash
   source ~/.bashrc
   ```

7. 启动仿真

   新打开一个终端, 前往~/catkin_ws/PX4-Autopilot目录下

   ```bash
   cd ~/catkin_ws/PX4-Autopilot
   ```

   启动px4 sitl仿真, 机型为固定翼(plane)

   ```bash
   make px4_sitl gazebo_plane
   ```

   ![image-20221206185806648](https://cdn.jsdelivr.net/gh/hanhan3344/pic/note_pic/image-20221206185806648.png)

   当gazebo模拟器成功启动, 画面中出现小飞机, 终端出现类似这样的信息时

   ![image-20221206185822088](https://cdn.jsdelivr.net/gh/hanhan3344/pic/note_pic/image-20221206185822088.png)

   ![image-20221206185835038](https://cdn.jsdelivr.net/gh/hanhan3344/pic/note_pic/image-20221206185835038.png)
   
   说明仿真启动成功, 此时控制台输入
   
   ```bash
   shutdown
   ```
   
   即可退出仿真
   
   ![image-20221206185924821](https://cdn.jsdelivr.net/gh/hanhan3344/pic/note_pic/image-20221206185924821.png)
