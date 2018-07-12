---
title: How to use Gitlab after enabling Two-Factor Authentication (2FA)?
category: Howto
tags: Gitlab 2FA Security
header:
  image: /assets/images/security.jpg
comments: true
---



You should always try to use Two-Factor Authentication whenever possible, as, it adds another layer of  protection and security. A few days ago, I also enabled 2FA in [Gitlab](https://gitlab.com). Everything worked fine, until I pushed my code using git and it told me to use Personal Access Token. 

I created the Personal Access Token using the [documentation](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html), but how to use it? :D

As a noob user, I couldn't find how to use this token, after searching for a while, I found the solution in some comment on Stackoverflow. 

### How?

First create a personal access token, name it anything and then give it access to `api`, thats all that is required. Then copy the token, perhaps save it also as you won't be able to see it again. Then use it as the password for your git account. If you are using Windows Credential Manager, go to your [Gitlab](https://gitlab.com) profile and then replace the password with this token. 

Everything should work fine now. :)

Buy me a cup of coffee with ETH: `0x681a83007bC52C0bF42B41263Dc498f9Ef7af02A`