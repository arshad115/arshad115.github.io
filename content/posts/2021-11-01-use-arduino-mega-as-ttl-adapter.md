---
title: How to use Arduino mega as a USB TTL Adapter
date: 2021-11-01
category: hardware
tags:
  - arduino
  - mega
  - usb
  - ttl
  - adapter
toc: false
header:
  image: /assets/images/posts/ttl1.jpeg
  alt: Arduino Mega 2560 with reset tied to ground
---

Using any Arduino as a USB to TTL Adapter is very easy. Just need to connect the **reset pin** with **grnd** pin to bypass the **ATmega** chip. The **Rx** and **Tx** pins can then be used as a normal *USB to TTL* Adapter. Below are some pictures:

![Arduino Mega with a jumper from reset to ground](/assets/images/posts/ttl1.jpeg)

![Second view of the Arduino Mega TTL wiring](/assets/images/posts/ttl2.jpeg)
