#!/bin/bash
brew services restart redis
brew services restart mongodb

pip install -r requirements.txt

cd news_pipeline
python news_monitor.py &
python news_fetcher.py &
python news_deduper.py &

echo "======================="