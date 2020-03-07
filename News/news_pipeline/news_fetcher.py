import os
import sys
from newspaper import Article

sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'common'))
sys.path.append(os.path.join(os.path.dirname(__file__), 'scrapers'))

import cnn_news_scraper
from rabbitMQ_client import RabbitMQClient


DEDUPE_NEWS_TASK_QUEUE_HOST = 'localhost'
DEDUPE_NEWS_TASK_QUEUE_NAME = 'dedupe-news-task-queue'
SCRAPE_NEWS_TASK_QUEUE_HOST = 'localhost'
SCRAPE_NEWS_TASK_QUEUE_NAME = "scrape-news-task-queue"

SLEEP_TIME_IN_SECONDS = 5

dedupe_news_queue_client = RabbitMQClient(DEDUPE_NEWS_TASK_QUEUE_HOST, DEDUPE_NEWS_TASK_QUEUE_NAME)
scrape_news_queue_client = RabbitMQClient(SCRAPE_NEWS_TASK_QUEUE_HOST, SCRAPE_NEWS_TASK_QUEUE_NAME)

def handle_message(msg):
    if msg is None or not isinstance(msg, dict):
        print("message is broken")
        return 
    task = msg
    article = Article(task['url'])
    article.download()
    article.parse()
    task['text'] = article.text

    # #Only support cnn for now
    # if(task['source']['name'] == 'CNN'):
    #     print("Scraping CNN news")
    #     text = cnn_news_scraper.extract_news(task['url'])
    # else:
    #     print("not supported")
    # task['text'] = text
    dedupe_news_queue_client.sendMessage(task)

while True:
    # Fetch message from queue
    if scrape_news_queue_client is not None:
        msg = scrape_news_queue_client.getMessage()
        if msg is not None:
            # Handle message: scrape news from websites
            try:
                handle_message(msg)
            except Exception as e:
                print(e)
                pass
        scrape_news_queue_client.sleep(SLEEP_TIME_IN_SECONDS)
