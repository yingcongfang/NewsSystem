import pika
import json

class RabbitMQClient:
    def __init__(self, host, queue_name):
        self.host = host
        self.queue_name = queue_name
        self.params = pika.ConnectionParameters(host=host)
        self.params.socket_timeout = 3
        self.connection = pika.BlockingConnection(
            pika.ConnectionParameters('localhost'))
        self.channel = self.connection.channel()
        self.channel.queue_declare(queue=queue_name)

    # send a message
    def sendMessage(self, message):
        self.channel.basic_publish(
            exchange='', routing_key=self.queue_name, body=json.dumps(message))
        
        print ("[X] Sent message to {}: {}" .format(self.queue_name, message))
        return
    # get a message
    def getMessage(self):
        method_frame, header_frame, body = self.channel.basic_get(self.queue_name)
        if method_frame is not None:
            print ("[O] receieved message from {}: {}" .format(self.queue_name, body))
            self.channel.basic_ack(method_frame.delivery_tag)
            return json.loads(body)
        else:
            print ("No message returned")
            return None
        
    def sleep(self, seconds):
        self.connection.sleep(seconds)
