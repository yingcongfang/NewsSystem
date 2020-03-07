from flask_jsonrpc.proxy import ServiceProxy
server = ServiceProxy('http://localhost:6060/api')

def classify(text):
    topic = server.classify(text)['result']
    print("Topic: {}".format(str(topic)))
    return topic
