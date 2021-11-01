---
title: "How to access Seagate COM Terminal with Arduino mega as a USB TTL Adapter and PUTTY"
category: Hardware
tags: arduino mega usb ttl seagate com terminal putty hdd
header:
  image: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Seagate2015_2c_horizontal_pos.png"
  caption: "Photo credit: [**Wikipedia**](https://de.wikipedia.org/wiki/Seagate_Technology)"
comments: true
---

### Accessing Seagate Hardrive Recovery/Diagnostics Ports:

The porst are shown here:

![https://sudonull.com/post/145870-Resurrect-HDD](https://habrastorage.org/storage2/471/e3b/097/471e3b097546725b54e9ef7e6c0d5dd7.png)

![ ]({{ "/assets/images/posts/hdd2.jpeg" | absolute_url }})

These ports need to be connected to a *USB to TTL* Adapter. In my previous post [How to use Arduino mega as a USB TTL Adapter](https://arshadmehmood.com/hardware/use-arduino-mega-as-ttl-adapter/), I wrote about using **Arduino** as  a **TTL** Adapter. We are going to connect these ports to **Arduino** as below:

![ ]({{ "/assets/images/posts/hdd1.jpeg" | absolute_url }})

### Accessing the terminal with PUTTY

After turning on the **Arduino**, find out the **COM** port from the device manager. 

Enter the following settings in [**PUTTY**](http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html):

![ ]({{ "/assets/images/posts/putty_com1.PNG" | absolute_url }})

![ ]({{ "/assets/images/posts/putty_com2.PNG" | absolute_url }})

In my case the port was *COM3*. Click on open and you should be good to go!





