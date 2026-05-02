# Real-Time Hashtag Counter

A small pub/sub demo: a producer streams synthetic tweets into Kafka, a 
FastAPI consumer aggregates hashtag counts in memory, and a browser frontend 
gets live updates over WebSockets.

Built to learn the Kafka → consumer → push-to-client pattern end to end.

## Architecture

producer.py  →  Kafka (topic: tweets)  →  FastAPI consumer  →  WebSocket  →  browser

The FastAPI app runs the Kafka consumer as a background task, updating an 
in-memory counter. Connected browsers receive the counter as JSON whenever 
it changes.

## Run it

Requires Python 3.11+ and Podman (or Docker).

```bash
podman compose up -d              # start Kafka
pip install -r requirements.txt
python producer.py &              # start producing fake tweets
uvicorn main:app --reload         # start the API + consumer
```

Open `index.html` in your browser to see live counts.
