import requests
import os
import random
from lxml import html


USER_AGENTS_FILE = os.path.join(os.path.dirname(__file__), 'user-agents.txt')
USER_AGENTS = []
GET_CNN_NEWS_XPATH = "//p[@class='zn-body__paragraph speakable']//text() | //div[@class='zn-body__paragraph speakable']//text() | //div[@class='zn-body__paragraph']//text()"

with open(USER_AGENTS_FILE, 'r') as uaf:
    for ua in uaf.readlines():
        if ua:
            USER_AGENTS.append(ua.strip())

random.shuffle(USER_AGENTS)

def getHeaders():
    ua = random.choice(USER_AGENTS)
    headers = {
        "Connection": "close",
        "User-Agent": ua
    }
    return headers

def extract_news(news_url):
    #Download html
    session_requests = requests.session()
    response = session_requests.get(news_url, headers=getHeaders())
    
    news = {}

    try:
        #Parse html
        tree = html.fromstring(response.content)
        print(tree)
        # Extract information
        news = tree.xpath(GET_CNN_NEWS_XPATH)
        print(news)
        news = ''.join(news)
    except Exception as e:
        print(e)
        return {}
    return news
