---
title: 修复内核更新失败导致的 dpkg 依赖错误
date: 2023-07-03 18:49:47
tags: 
  - ubuntu
  - linux
categories: 
  - linux
top_img: https://images.weserv.nl/?url=https://hanhan3344-tx-bk-1313563340.cos.ap-guangzhou.myqcloud.com/typora/elysia05.jpg&default=https://hanhan3344-tx-bk-1313563340.cos.ap-guangzhou.myqcloud.com/typora/elysia05.jpg
cover: https://images.weserv.nl/?url=https://cdn.jsdelivr.net/gh/hanhan3344/pic/note_pic/20230815220009.jpg&default=https://cdn.jsdelivr.net/gh/hanhan3344/pic/note_pic/20230815220009.jpg
---

# 修复内核更新失败导致的 dpkg 依赖错误

## 第一步：备份

```shell
sudo mv /var/lib/dpkg/info /var/lib/dpkg/info.bk
```

## 第二步：新建

```shell
sudo mkdir /var/lib/dpkg/info
```

## 第三步：更新

```shell
sudo apt-get update 
sudo apt-get -f install
```

## 第四步：替换

```shell
sudo mv /var/lib/dpkg/info/* /var/lib/dpkg/info.bk
```

## 第五步：删除

```shell
sudo rm -rf /var/lib/dpkg/info 
```

## 第六步：还原

```shell
sudo mv /var/lib/dpkg/info.bk /var/lib/dpkg/info 
```

