from rabbitMQ_client import RabbitMQClient

HOST = 'localhost'
TEST_QUEUE_NAME = 'test'

def test_basic():
    client = RabbitMQClient(HOST, TEST_QUEUE_NAME)

    sentMsg = {'test': 'demo'}
    client.sendMessage(sentMsg)
    client.sleep(10)
    receivedMsg = client.getMessage()
    assert sentMsg == receivedMsg
    print ('test_basic passed!')

if __name__ == "__main__":
    test_basic();
