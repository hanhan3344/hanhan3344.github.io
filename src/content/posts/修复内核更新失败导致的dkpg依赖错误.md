---
title: 修复内核更新失败导致的dkpg依赖错误
slug: fix-dpkg-dependency-errors
legacySlug: 修复内核更新失败导致的dkpg依赖错误
description: 通过备份与还原 dpkg 信息目录，逐步修复内核更新失败引发的依赖问题。
date: 2023-08-15T22:31:20+08:00
tags:
  - ubuntu
  - linux
categories:
  - linux
cover: https://images.weserv.nl/?url=https://cdn.jsdelivr.net/gh/hanhan3344/pic/note_pic/20230815220009.jpg&default=https://cdn.jsdelivr.net/gh/hanhan3344/pic/note_pic/20230815220009.jpg
---

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
