# Mastodon_Feed

- Publish to Mastodon through ATOM and RSS feeds
- Automatic translation of feeding ATOM and RSS  into Arabic

Example [@Arfeed](https://bassam.social/@Arfeed)


- edit config.json 

```json
{
    "mastodon_server":"https://bassam.social",
    "token":"5LK0lkoB3IP86T7VokepZBLsaZ3ShmqNlSIJ-KKmPtc",
    "urls": [
        "http://www.omgubuntu.co.uk/feed",
        "http://9to5linux.com/feed",
        "http://discourse.aosus.org/latest.rss",
        "http://itsfoss.com/feed",
        "http://www.webupd8.org/rss.xml",
        "http://frontpagelinux.com/feed",
        "http://www.tecmint.com/feed",
        "http://ubuntu.com/blog/feed",
        "http://spreadprivacy.com/rss",
        "http://www.redhat.com/sysadmin/rss.xml",
        "http://www.kali.org/rss.xml",
        "http://matrix.org/blog/feed",
        "http://www.pine64.org/feed",
        "http://rockylinux.org/rss.xml",
        "http://forums.whonix.org/tags/important-news.rss",
        "http://blog.barmej.com/feed",
        "http://www.tutomena.com/rss.xml",
        "http://blog.abdelhadi.org/rss",
        "http://badwi.com/rss",
        "http://informatic-ar.com/feed",
        "http://colorslab.com/blog/feed",
        "http://feeds.feedburner.com/itwadi",
        "http://blog.edraak.org/feed"
    ]
}
```


# Linux


```bash
   > sudo apt-get install nodejs
   > sudo apt-get install git
   > sudo apt-get install google-chrome-stable
   > git clone https://github.com/rn0x/Mastodon_Feed
   > cd Mastodon_Feed
   > nano config.json
   > npm i
   > npm start
```




# LICENSE 

[MIT](https://github.com/rn0x/Mastodon_Feed/blob/main/LICENSE)
