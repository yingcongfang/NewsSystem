import sys
import os
import redis
import hashlib
import datetime
import json


sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'common'))
import news_api_client
from rabbitMQ_client import RabbitMQClient

REDIS_HOST = 'localhost'
REDIS_PORT = 6379

SCRAPE_NEWS_TASK_QUEUE_HOST = 'localhost'
SCRAPE_NEWS_TASK_QUEUE_NAME = "scrape-news-task-queue"

NEWS_SOURCES = [
    'cnn, bbc-news, bloomberg, espn, cnbc, business-insider, abc-news, buzzfeed, bbc-sport, fox-news, the-verge, techradar, talksport, nfl-news, nhl-news, reddit-r-all']

NEWS_TIME_OUT_IN_SECONDS = 3600 * 24
SLEEP_TIME_IN_SECONDS = 60

redis_client = redis.StrictRedis(REDIS_HOST, REDIS_PORT)
rabbitMQ_client = RabbitMQClient(SCRAPE_NEWS_TASK_QUEUE_HOST, SCRAPE_NEWS_TASK_QUEUE_NAME)

while True:
    news_list = news_api_client.getNewsFromSource(NEWS_SOURCES)

    nums_of_new_news = 0
    for news in news_list:
        news_digest = hashlib.md5(news['title'].encode('utf-8')).hexdigest()

        if redis_client.get(news_digest) is None:
            nums_of_new_news += 1
            news['digest'] = news_digest

            if news['publishedAt'] is None:
                news['publishedAt'] = datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")
            redis_client.set(news_digest, json.dumps(news))
            redis_client.expire(str(news), NEWS_TIME_OUT_IN_SECONDS)

            rabbitMQ_client.sendMessage(news)

    print("Fetched {} new news" .format(nums_of_new_news))

    rabbitMQ_client.sleep(SLEEP_TIME_IN_SECONDS)
