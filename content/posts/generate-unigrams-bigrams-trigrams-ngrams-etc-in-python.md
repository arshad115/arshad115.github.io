---
title: "Generate Unigrams, Bigrams, Trigrams, n-grams etc in Python"
category: Tutorial
tags:
  - python
  - nlp
  - text-processing
  - n-grams
  - programming
header:
  image: /assets/images/nltk.png
  teaser: /assets/images/nltk_teaser.png
comments: true
excerpt: "Learn how to generate n-grams (unigrams, bigrams, trigrams) in Python using NLTK and custom functions. Complete guide for text processing and NLP tasks."
---To generate unigrams, bigrams, trigrams or n-grams, you can use python's [**Natural Language Toolkit (NLTK)**](https://github.com/nltk/nltk), which makes it so easy.

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