---
category: Hacks
tags: ledger nano crytpocurrency tip
title: "Ledger Nano S solution for stuck on 'Update' while updating to firmware 1.4.1"
header:
  image: /assets/images/ledger-wallet.png
  teaser: /assets/images/ledger_icon.png  
comments: true
---

Hardware wallets are the safest and most convenient way to store cryptocurrency. The good thing about Ledger Nano S is that the private keys of your wallets are never shared.

After waiting for a long time, I recieved my Ledger Nano S cryptocurrency hardware wallet today. Upon configuring, it asked me to update the firmware to 1.4.1. 

![Update to 1.4.1]({{ "/assets/images/posts/ledger141.png" | absolute_url }})

I followed the procedure and it worked fine untill it got stuck on "Update".

![Stuck on Update]({{ "/assets/images/posts/ledger_update.jpg" | absolute_url }})

I had tried using other USB ports also but it didn't work. I noticed that it doesn't make the windows sound of plugging in a device. The problem is simple, as well as the solution. The drivers are not installed properly. To fix the issue, simply follow these steps:


On Windows:

1. Open device manager.
2. Find the USB device with a yellow symbol on it.
3. Right click and select update driver.
4. Click search automatically.
5. Your ledger would be detected now by the Ledger Manager.

If it doesn't work, then disconnect your Ledger Nano S and close Ledger Manager. Start Ledger Manager and insert Ledger device to a USB 2.0 port while pressing the button close to the usb port on the device.

Goodluck!