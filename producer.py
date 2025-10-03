from kafka import KafkaProducer
from kafka.errors import KafkaError
import json
import random
import time

producer = KafkaProducer(
    bootstrap_servers='127.0.0.1:9092',
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

hashtags = ['politics', 'war', 'economy', 'sports', 'entertainment', 'technology', 'health', 'science', 'travel', 'food']
tweet_id = 0

try:
    while True:
        faketweet = {
            'id': tweet_id,
            'text': f'This is fake tweet #{tweet_id} for testing purposes.',
            'hashtag': random.choice(hashtags)
        }

        # Send to Kafka
        print(f"Sending: {faketweet}")
        future = producer.send('tweets', value=faketweet)
        
        try:
            record_metadata = future.get(timeout=10)
        except KafkaError as e:
            print(f"Failed to send message: {e}")
        
        tweet_id += 1
        time.sleep(4) 
        
except KeyboardInterrupt:
    print("\nShutting down producer...")
finally:
    producer.close()