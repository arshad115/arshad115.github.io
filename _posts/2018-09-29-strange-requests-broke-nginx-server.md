---
title: "Strange Requests broke my nginx server"
category: Security
tags:
  - security
  - nginx
  - server
  - attack
header:
  image: /assets/images/posts/site-down.PNG
  teaser: "https://asdqwe.net/wp-content/uploads/2016/04/504.jpg"
comments: true
toc: false
---

Since the last month I am developing a Node.js application with Vue.js and recently, I bought a server and uploaded my still in development site there. I deployed my test application to the server just one week ago and yesterday, I noticed a strange 504 Gateway error. Hmm...strange! Upon googling, I found out that the **504 Gateway Timeout error** is an HTTP status code that means that one server did not receive a timely response from another server that it was accessing while attempting to load the web page or fill another request by the browser. I checked my backend and it is working fine,  for my other server too. 

I am running [NGINX] (https://www.nginx.com/) web server and decided to look at the access and error logs. I saw some strange requests which look like hacking attempts by a bot. There are a lot of http requests and most of them are served with a 404 error. A preview of the requests is here:

![Strange requests]({{ "/assets/images/posts/access-logs.PNG" | absolute_url }})

It looks like the bot is trying to access the server files using http. I still don't know what exactly happened, but, these request broke my server and perhaps installed a worm or a malware on the system too.  For now, I have redeployed my application and blocked all http requests, as the requests are mostly http based. SSL is already configured on my server. 

The closest thing I found is this answer on [Stackoverflow](https://security.stackexchange.com/questions/40291/strange-requests-to-web-server), which also says that they are automated attacks. I have to do some digging, if anyone has any clue, please do write in the comments. I will post an update on my blog, of what I find. 