from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from kafka import KafkaConsumer
import json
import asyncio

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
hashtag_counts = {}

# Run Kafka consumer in a separate thread
def kafka_consumer_thread():
    consumer = KafkaConsumer(
        'tweets',
        bootstrap_servers='127.0.0.1:9092',
        auto_offset_reset='earliest',
        enable_auto_commit=True,
        group_id='websocket-group',
        value_deserializer=lambda v: json.loads(v.decode('utf-8'))
    )
    for message in consumer:
        tweet = message.value
        hashtag = tweet.get('hashtag')
        if hashtag:
            if hashtag in hashtag_counts:
                hashtag_counts[hashtag] += 1
            else:
                hashtag_counts[hashtag] = 1


@app.websocket("/ws/hashtags")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("WebSocket client connected") 
    try:
        while True:
            await websocket.send_json(dict(hashtag_counts))
            await asyncio.sleep(1)
    except Exception as e:
        print("WebSocket disconnected:", e)

# Starts background Kafka consumer when server starts
@app.on_event("startup")
async def startup_event():
    asyncio.create_task(asyncio.to_thread(kafka_consumer_thread))
    print("Kafka consumer started in background thread")