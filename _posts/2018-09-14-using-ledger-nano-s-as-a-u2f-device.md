---
title: "Using Ledger Nano S as a Universal 2nd Factor Authentication (U2F) device"
category: Tutorial
tags: 
  - cryptocurrency
  - bitcoin
  - ethereum
  - ledger
  - ledger-nano-s
  - u2f
  - 2fa
  - authentication
header:
  image: "https://www.yubico.com/wp-content/uploads/2014/10/Slider-U2F-02.png"
  caption: "Photo credit: [**Yubico**](https://www.yubico.com/solutions/fido-u2f/)"
  teaser: "https://s3.amazonaws.com/groovehq/uploaded/2g796cjbudshjd3xhucaewpxgv70x403ms102ar50fx9zzex27?1488402680"
comments: true
---


> [Skip right to, how to use it with Ledger Nano S](#how-to-use-ledger-nano-s-as-a-u2f-device)

### What is U2F?

U2F is an open authentication standard that enables Internet users to securely access any number of online services with one single security key instantly and with no drivers or client software needed. U2F was created by Google and Yubico. Simply put, they are security keys or USB devices which store a secret password on the device safely and allow you access to the website by providing a second layer of protection called Two Factor Authentication or 2FA. U2F is more secure as it not only stores the security key, but also the correct domain of the site with key. So a fake phishing website will not be able to authenticate using your key. 

### Which sites support it?

A plenty of sites already support it. You can check the updated list [here](https://www.yubico.com/works-with/catalog/#FIDO-U2F) or [here](https://www.dongleauth.info/). Some popular sites where I use U2F are [Google](https://www.google.com/intl/en-US/landing/2step/features.html), [Facebook](https://www.facebook.com/help/148233965247823), [Twitter](https://help.twitter.com/en/managing-your-account/two-factor-authentication),  [Github](https://help.github.com/articles/about-two-factor-authentication/) and [Gitlab](https://docs.gitlab.com/ee/user/profile/account/two_factor_authentication.html). I would love to use it many other sites, but the support is really slow.

### How does it work?

After you register your security key on the website, you simply have to plug in the key and allow the site to authenticate on your key after entering your credentials on that site. If you don't have your security key with you, then it will fall back to 2FA code or other backup method.

### How to use Ledger Nano S as a U2F Device

You have a plenty of options when buying a U2F device. Or, if you already have a [Ledger Nano S](https://www.ledger.com/?r=febd7201637a) to store some cryptocurrencies, then you can use it with just a few simple steps. You just have to install an app!

1. Open [Ledger Live](https://www.ledger.com/pages/ledger-live)

2. Connect your device, Unlock and Allow manager to control your device.

3. Go to Manager tab in Ledger Live.

4. Install the Fido U2F application by clicking on the green download button. 

   ![Fido U2f](https://support.ledgerwallet.com/hc/article_attachments/360004255734/InstallFidoU2F.png)

5. Open the Fido U2F app, its now the app is ready to use.
6. Go to your site, where you want to register the device.
7. Select add security key or a similar option.
8. The device will show, if you want to add this service. 
9. Click yes, the device is now registered, make sure you have some other method as a backup to login if you lose your key. e.g. 2FA.
10. The next time you login, you just have to connect your Nano to the computer and open the app and allow to authenticate.

Support me with ETH: `0x681a83007bC52C0bF42B41263Dc498f9Ef7af02A` 

Read the original guidelines on [Ledger Support site](https://support.ledgerwallet.com/hc/en-us/articles/115005198545-Set-up-Fido-U2F-app)
[![Ledger Nano S - The secure hardware wallet](https://www.ledgerwallet.com/images/promo/nano-s/ledger_nano-s_8-5-0x4-2-0.jpg)](https://www.ledger.com?r=febd7201637a)

You can also do the same with a [Trezor](https://doc.satoshilabs.com/trezor-user/u2f.html)
[![Trezor hardware wallet](https://trezor.io/static/images/devices.webp)](https://shop.trezor.io/?a=arshadmehmood.com)

   