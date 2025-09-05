---
title: "Generate unigrams, bigrams, trigrams, n-grams etc. in Python"
category: Development
tags: 
  - python
  - programming
  - unigram
  - bigram
  - trigram
  - n-grams
  - nlp
  - text-processing
header:
  image: https://www.oreilly.com/library/view/artificial-intelligence-for/9781788472173/assets/447da4ba-e40a-4787-a2f2-20a906077475.png
  teaser: https://tr4.cbsistatic.com/hub/i/2018/01/24/e9ce7e9e-ce70-4281-909f-7fdc5e525e3a/wordcloudc.jpg
comments: true
---

To generate unigrams, bigrams, trigrams or n-grams, you can use python's [**Natural Language Toolkit (NLTK)**](https://github.com/nltk/nltk), which makes it so easy.

### First steps

Run this script once to download and install the punctuation tokenizer:

 ```python
 import nltk
 nltk.download('punkt') 
 ```

### Unigrams, bigrams and trigrams

By using these methods you will get the lists for each:

```python
from nltk word_tokenize
from nltk import bigrams, trigrams

unigrams = word_tokenize("The quick brown fox jumps over the lazy dog")
bigrams = bigrams(unigrams)
trigrams = trigrams(unigrams)
```
##### Hint for unigrams
For simple unigrams you can also split the strings with a space.

### n-grams 

To generate `4-grams` *(n = 4)*:

```python
from nltk word_tokenize
from nltk import bigrams, trigrams

unigrams = word_tokenize("The quick brown fox jumps over the lazy dog")
4grams =  ngrams(unigrams, 4)
```

### n-grams in a range

To generate n-grams for m to n order, use the method `everygrams`:
Here `n=2` and `m=6`, it will generate `2-grams`,`3-grams`,`4-grams`,`5-grams` and `6-grams`.
```python
from nltk word_tokenize
from nltk import bigrams, trigrams

unigrams = word_tokenize("The quick brown fox jumps over the lazy dog")
2to6grams = everygrams(unigrams, 2, 6)
```

More info about the `nltk` can be found [here](https://github.com/nltk/nltk/wiki/Frequently-Asked-Questions-(Stackoverflow-Edition)).