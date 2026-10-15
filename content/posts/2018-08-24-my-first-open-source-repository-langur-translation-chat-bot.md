---
title: My first open source repository - Langur translation chat bot
date: 2018-08-24
category: development
tags:
  - bots
  - nodejs
  - bot-framework
  - open-source
  - translation
header:
  image: /assets/images/langur_teaser.png
  alt: Langur translation chatbot conversation screenshot
  teaser: /assets/images/langur.jpg
---

Sometime ago, I made a chatbot from translating one language to another called [Langur](https://arshadmehmood.com/development/langur-language-translation-bot/). Today, I have decided to make it open source, so that people can learn from it and make chat bots easily. It's my very first open source repository and way of contributing to the open source community. The bot is live and it has some channels linked to it, you can test it in the demo section. It's really simple and anyone can do. You will find the [Language translation chat bot on Github](https://github.com/arshad115/langur-translation-bot). Here is a little intro about what it does and how to use it. 



<a href="https://imgur.com/0tg1mAh"><img style="float: right;" src="https://i.imgur.com/0tg1mAht.png" width="160" height="160" loading="lazy" decoding="async" alt="Langur chat asking for a source and target language" title="source: imgur.com" /></a>

Langur is a translation chat bot made with [Microsoft Bot Framework](https://dev.botframework.com/) with [Node.js](http://nodejs.org)  and a free [Google translate Api](https://github.com/matheuss/google-translate-api). You can read more about it on my [blog](https://arshadmehmood.com/development/langur-language-translation-bot/).

### Demo:

Fb Messenger
<a href="https://www.messenger.com/t/2053091328235574">Message Langur on Messenger</a>

kik
<a href='https://bots.kik.com/#/langurtranslator'>langurtranslator</a>

Facebook page: 
<a href="https://fb.me/LangurTranslator">fb.me/LangurTranslator</a>

### How it works:
In the beginning, the bot asks you for your source and target language and then it translates whatever you type into it. 



### To run:

> Install dependencies:
```js
npm install
```

> Insert your `appId` and `appPassword`
> After installing the dependcies, [create a bot](https://dev.botframework.com/bots/new) on the Microsoft Bot framework. Get the `appId` and the `appPassword`. Replace these values here:

```js

var keys = require('./keys.js'); //Remove it, used only to import appId and appPassword

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: keys.appId, //Replace with App Id from your Microsoft bot
    appPassword: keys.appPassword //Replace with App Password from your Microsoft bot
});

```
Or create a file named: `keys.js` and export these values. 

> Run the app
```js
node app.js
```

<img src="https://i.imgur.com/d7MXzlT.png" width="582" height="85" loading="lazy" decoding="async" alt="Microsoft Bot Emulator connection settings" />

> Install Microsoft Bot Emulator 

Download and Install [Microsoft Bot Framework Emulator](https://github.com/Microsoft/BotFramework-Emulator/releases) to run on localhost.

Enter your appId and appPassword and click connect, 

<img src="https://i.imgur.com/bTS1Rri.png" width="795" height="601" loading="lazy" decoding="async" alt="Langur chatbot running in the Bot Emulator" />



Afterwards, you can interact with the bot like so:

<img src="https://i.imgur.com/eF4HWwn.png" width="619" height="867" loading="lazy" decoding="async" alt="Langur translating a chat message" />



### License

Langur - Language translation chat bot is released under the [GNU General Public License v3.0](https://github.com/arshad115/langur-translation-bot/blob/master/LICENSE). Please refer to the LICENSE file for detailed information.

Copyright: [Arshad Mehmood](https://arshadmehmood.com/)
