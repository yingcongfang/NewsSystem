import cnn_news_scraper

EXPECTED_NEWS = "Lawmakers in the room watched as the weight of his duties as commander-in-chief bore down on him, lives hanging in the balance."
CNN_NEWS_URL = "http://us.cnn.com/2019/06/21/politics/donald-trump-iran-decision-details/index.html"

def basic_test():
    news = cnn_news_scraper.extract_news(CNN_NEWS_URL)
    assert EXPECTED_NEWS in news
    print("basic test passed!")
if __name__ == "__main__":
    basic_test()