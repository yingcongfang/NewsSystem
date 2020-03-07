import os
import sys
import json
from bson.json_util import dumps
from flask import Flask
from flask_jsonrpc import JSONRPC
import operations

sys.path.append(os.path.join(os.path.dirname(__file__), '../', 'common'))
import mongodb_client

# Flask application
app = Flask(__name__)

# Flask-JSONRPC
jsonrpc = JSONRPC(app, '/api', enable_web_browsable_api=True)

@jsonrpc.method('index')
def index():
	return 'Welcome to Flask JSON-RPC'


@jsonrpc.method('add')
def add(a, b):
    """Test method"""
    print("add is called with {} and {}".format(a, b))
    return a + b

@jsonrpc.method('getNews')
def getNews():
    """Get news from mongodb"""
    db = mongodb_client.get_db()
    print(db)
    news = list(db['demo'].find())
    return json.loads(dumps(news))


@jsonrpc.method('getNewsSummariesForUser')
def getNewsSummariesForUser(user_id, page_num):
    """Get news summary from mongodb"""
    print("hello")
    return operations.getNewsSummariesForUser(user_id, page_num)


@jsonrpc.method('logNewsClickForUser')
def logNewsClickForUser(user_id, news_id):
    """Log user news clicks"""
    print(user_id)
    return operations.logNewsClickForUser(user_id, news_id)

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
