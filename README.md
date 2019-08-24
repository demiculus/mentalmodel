# Mental Model Practices Jekyll Repo

If you want to test the site on local, first install the gems

```
bundle install
```

Then run

```
bundle exec jekyll serve --baseurl "" --watch
```

# Missing Review Pages

If some reviews are missing on the main page, you can find them by running

```
echo $(ls -1 _analyses/ | sed 's/\.md//g') $(ls -1 _site/analyses) | sed 's/ /\n/g' | sort | uniq -u
```

For Turkish sites:

```
echo $(ls -1 _analyses_tr/ | sed 's/\.md//g') $(ls -1 _site/tr/analyses) | sed 's/ /\n/g' | sort | uniq -u
```


# Writing a Review Markdown File

As of now, an example analysis page looks like this:

```markdown
---
layout: analysis
coin: crowdcoin
tldr: "Building an ecosystem to learn/invest/news/exchange/fund cryptos."
score: -1
researcher: demiculus
date: 2018-05-18
conclusion: "Wowsuchgoodgoin"
---

- Blabla

Pros

- Blabla

Cons

- Blabla

```
