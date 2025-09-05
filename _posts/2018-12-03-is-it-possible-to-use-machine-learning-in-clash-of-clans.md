---
title: "Is it possible to use machine learning to build the best bases in Clash of Clans?"
category: Personal
tags: 
  - clash-of-clans
  - machine-learning
  - deep-learning
  - neural-networks
  - gaming
  - thoughts
header:
  image: https://www.google.com/url?sa=i&source=images&cd=&ved=2ahUKEwi43avrtaziAhUNyaQKHQJ8BFAQjRx6BAgBEAU&url=https%3A%2F%2Fmedium.com%2Ftradecraft-traction%2Fthe-secrets-behind-a-5m-per-day-mobile-game-clash-of-clans-24d45cd39019&psig=AOvVaw05DJoxSlXGBXNZq7M7PR3C&ust=1558521099658975
  teaser: https://yt3.ggpht.com/a-/AN66SAxf2g4A2F_v2klgv4V05TV2KYBlRhIg21qj6Q=s900-mo-c-c0xffffffff-rj-k-no
comments: true
---

If you are living under a rock for the past few years, then you probably don't know about Clash of Clans. [Clash of Clans](https://supercell.com/en/games/clashofclans/) is a strategy game for Android and iOS, published by [Supercell](https://supercell.com/en/) back in 2012.

I've been playing it for many years, given its [addictive nature](https://www.businessinsider.com/why-clash-of-clans-is-so-popular-2014-9?IR=T). Here is a simple introduction, within the game, you have different defenses and other players attack your base to steal your gold and other resources. Every player's base layout is different, and you basically have to build your base strategically to defend successfully from attacks and protect your resources. There are [many sites](https://www.clashofclans-tools.com/Layouts/Top) where users have posted their own base layouts based on their effectiveness. The base layouts show the max level of the defenses and sometimes do not exactly defend so well, this got me thinking: **How to build the perfect base?**

![Not a perfect base](https://thatsmytop10.com/wp-content/uploads/2014/05/Top-10-Funny-COC-Base-no-1.jpg)

### Can we use artificial intelligence please?

Yes! Definitely! It is possible, but *(there's always a but)*, it won't be easy as we don't have access to the game code and there is no emulator for the game. During my bachelors and masters, I have studied machine learning and artificial intelligence. It's possible to make a [evolving neural network](http://nn.cs.utexas.edu/downloads/papers/stanley.ec02.pdf) for this given problem, if you feed it attributes of all the buildings and defenses available in the game and observing the fitness of the network based on the function of damage to the base. There are different heros and troops available on each Town Hall level within the game, and many different defense structures along with the blocking structures such as walls and other buildings. Each defense structure and troop has different level of power and range of tiles. It makes the problem statement huge. Perhaps its easy to solve this problem using maths only, without any visualizations. 

Some years ago, I also saw this video of AI playing a single level of mario:

<iframe width="560" height="315" src="https://www.youtube.com/embed/qv6UVOQ0F44" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> 

So, its definitely possible, but somewhat difficult. There are some frameworks also, so far, I found this framework called [universe](https://github.com/openai/universe) which is no longer maintained. I will comeback to this after my exams. Let me know if there is any other framework available or how would you solve this problem?

> Note: *I am not affiliated in any way with Supercell*
