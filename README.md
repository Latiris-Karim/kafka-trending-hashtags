# Real-Time Twitter Hashtag Counter

A minimal demo that streams simulated tweets into **Kafka**, consumes them with a background Kafka consumer inside a **FastAPI** app, and pushes live hashtag counts to browsers via **WebSockets**.

---

## Features

* Kafka topic `tweets` receives JSON tweet messages (e.g. `{ "hashtag": "#python" }`).
* A background Kafka consumer updates an in-memory `hashtag_counts` dictionary.
* FastAPI exposes a WebSocket endpoint `/ws/hashtags` that streams live counts as JSON to connected clients.
* `index.html` displays the live counts in the browser with separate CSS and JS files for clean structure.

---

## Getting Started (Windows + Podman)

### 1) Clone repository

```powershell
git clone <your-repo-url>
cd <your-repo-directory>
```

### 2) Install dependencies

```powershell
pip install -r requirements.txt
```

### 3) Start Kafka with Podman Compose

```powershell
podman compose up -d
```

(Optional) If your broker doesn’t auto-create topics:

```powershell
podman exec -it kafka kafka-topics --create --topic tweets --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1
```

### 4) Run the producer (generate tweets)

```powershell
python producer.py
```

### 5) Run the FastAPI server

```powershell
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

WebSocket endpoint:

```
ws://127.0.0.1:8000/ws/hashtags
```

### 6) Open the frontend

Open `index.html` in your browser. It will connect to the WebSocket and show live hashtag counts. The project uses external `css/style.css` and `js/leaderboard.js` for styling and logic.

---

## Notes

* This demo uses plaintext Kafka listeners and anonymous access — not production-ready.
* For production, configure TLS, authentication, and persistent storage.
