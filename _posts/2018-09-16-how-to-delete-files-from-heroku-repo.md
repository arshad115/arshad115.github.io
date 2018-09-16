---
title: "How to delete files from a Heroku app repository"
category: HowTo
tags: Git Heroku repo plugin
header:
  image: "https://www.lc-tech.com/wp-content/themes/u-design/styles/common-images/Delete_Banner.jpg"
  caption: "Photo credit: [**lc-tech.com**](https://www.lc-tech.com/pc/filextinguisher/)"
  teaser: "https://miro.medium.com/max/768/1*w2RAR48UbSAYv-6y_V-cdA.png"
comments: true
---

It's frustrating when you push some code to [Heroku](https://www.heroku.com/) and some files are just not deleted and [Heroku](https://www.heroku.com/) serves you an old version of your code with a mix of new files. Well, worry no more! You can simply delete the old files on your [Heroku](https://www.heroku.com/) app using this [Heroku repo](https://github.com/heroku/heroku-repo) plugin developed by [Heroku](https://www.heroku.com/) .

It's very easy to use and you can delete or reset your app in just two lines of code.

### Heroku repo plugin

1. Install the plugin using:

   ```javascript
   heroku plugins:install heroku-repo
   ```

2. Reset repo using:
   ```javascript
   heroku repo:reset -a appname
   ```

Now your [Heroku](https://www.heroku.com/) will be just as new. Push your code and it will be like, you just pushed some code to a new app. Cheers!

Buy me a cup of coffee with ETH: `0x681a83007bC52C0bF42B41263Dc498f9Ef7af02A` 