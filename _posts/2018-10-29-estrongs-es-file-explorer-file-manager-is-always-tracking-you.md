---
category: Security
tags: 
  - Es File Explorer File Manager
  - Privacy
  - Tracking
  - Ads
header:
  image: /assets/images/es_header.png
  teaser: /assets/images/es_teaser.png
comments: true
---

[Es File Explorer File Manager](https://play.google.com/store/apps/details?id=com.estrongs.android.pop) was one the best File managers for Android for the past few years. But they have definitely *killed the goose that layed the golden eggs*, by [adding ads to users lockscreens, without their consent](https://www.androidpit.com/this-is-why-you-should-not-use-es-file-explorer) and by tracking users, with their indirect consent(as mentioned in their privacy policy). 

I am an Android developer and while developing one of my apps, I noticed that Android device got slow recently and I was getting lots of error messages on the logcat console in Android studio. At first, I thought the errors are from my app, but later I found out that they are from Es File Explorer, I decided to investigate further. I saw that Es File Explorer is constantly tracking and sending data to their servers in the background.

![Tracking]({{ "/assets/images/posts/tracking_es_manager.PNG" | absolute_url }})

Here is one the decoded request:

```
http://www.estrongs.com/console/service/sample/index.php?source=ESF&country=us&unique_id=LORIC6gwj4Ixo9Ce2Orl6g==&check_modify=1&modify_key=21_1447826873|24_1444888709|25_1448439534|35_1446794822|42_1442904834|46_1442558032|48_1445226105|50_1450087570|51_1441621473|52_1443090887|53_1442562425|54_1443581547|55_1462794043|56_1442907274|57_1448041476|58_1444714745|60_1448041589|64_1446647287|66_1444967946|69_1450257313|71_1446232444|73_1446229808|74_1446727398|75_1448612592|76_1477034790|80_1448532222|81_1448253005|82_1448532227|83_1448036242|84_1449208436|96_1448629534|97_1448629528|104_1450085875|105_1450061735|106_1450061725|107_1450094597|114_1450950870|115_1450950905|116_1451373200|124_1457064606|45
```

Apparently, `LORIC6gwj4Ixo9Ce2Orl6g` is my unique id for background tracking. The other keys are encrypted and I don't know what data is being sent. I had not opened the app for a long time, and also didn't update the app, which explains the errors because the web api links for tracking were not working.

Along with that, I saw that it is also requesting, connection info and location data. 

![Tracking]({{ "/assets/images/posts/Estrong_File_manager.PNG" | absolute_url }})

Not only that, the adwares in Es File Explorer are also running in the background and tracking you, the ones which I saw in logcat are `DuSwipe` and `Appsflyer`. They would be generating lots of data by tracking their 300 Million users. I am not a security expert but, I found out that they are monitoring me in the background, without telling me, I have uninstalled their app. 

[Here is the log file](/assets/images/posts/estrong.txt) with filter for `Estrong.

Support me with ETH: `0x681a83007bC52C0bF42B41263Dc498f9Ef7af02A` 
