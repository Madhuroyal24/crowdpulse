# ============================================================
# CrowdPulse — Real-Time Database & Web Server
# Serves static web files + REST API + SSE Real-Time Data Sync
# ============================================================

import os, json, time, threading
from http.server import HTTPServer, SimpleHTTPRequestHandler

PORT = 8080
DB_FILE = os.path.join(os.path.dirname(__file__), 'database.json')

# Initial Seed Database
DEFAULT_DB = {
  "venues": [
    {
      "id": "venue_sbi_mg",
      "name": "State Bank of India — MG Road",
      "category": "Bank / ATM",
      "address": "MG Road, Central Circle",
      "city": "Bangalore",
      "lat": 12.9756, "lng": 77.6094,
      "currentCrowd": "High", "predictedCrowd": "High",
      "waitTime": 35, "confidence": 0.95,
      "bestTimeToVisit": "2:00 PM – 3:30 PM", "bestTimeWait": 4,
      "openHours": "9:30 AM – 5:00 PM", "isFav": True,
      "reports": [
        { "id": "r1", "userId": "u1", "user": "Ravi Kumar", "crowd": "High", "wait": 35, "ts": int(time.time()*1000)-600000, "comment": "Deposit counters have 15+ people in queue.", "approved": True }
      ]
    },
    {
      "id": "venue_hdfc_indiranagar",
      "name": "HDFC Bank & Currency Exchange",
      "category": "Bank / ATM",
      "address": "Indiranagar 100ft Road",
      "city": "Bangalore",
      "lat": 12.9784, "lng": 77.6408,
      "currentCrowd": "Moderate", "predictedCrowd": "Low",
      "waitTime": 12, "confidence": 0.91,
      "bestTimeToVisit": "1:30 PM – 3:00 PM", "bestTimeWait": 3,
      "openHours": "9:00 AM – 6:00 PM", "isFav": False,
      "reports": []
    },
    {
      "id": "venue_spar",
      "name": "Spar Hypermarket",
      "category": "Supermarket",
      "address": "RMZ Galleria Mall, Yelahanka",
      "city": "Bangalore",
      "lat": 13.0991, "lng": 77.5956,
      "currentCrowd": "Low", "predictedCrowd": "Low",
      "waitTime": 3, "confidence": 0.94,
      "bestTimeToVisit": "10:00 AM – 11:30 AM", "bestTimeWait": 2,
      "openHours": "10:00 AM – 10:00 PM", "isFav": True,
      "reports": []
    },
    {
      "id": "venue_manipal",
      "name": "Manipal Hospital",
      "category": "Hospital",
      "address": "HAL Old Airport Road",
      "city": "Bangalore",
      "lat": 12.9592, "lng": 77.6444,
      "currentCrowd": "High", "predictedCrowd": "High",
      "waitTime": 28, "confidence": 0.88,
      "bestTimeToVisit": "3:30 PM – 5:00 PM", "bestTimeWait": 6,
      "openHours": "8:00 AM – 8:00 PM", "isFav": False,
      "reports": []
    },
    {
      "id": "venue_phoenix",
      "name": "Phoenix Marketcity",
      "category": "Shopping Mall",
      "address": "Whitefield Main Road",
      "city": "Bangalore",
      "lat": 12.9959, "lng": 77.6963,
      "currentCrowd": "Moderate", "predictedCrowd": "High",
      "waitTime": 15, "confidence": 0.91,
      "bestTimeToVisit": "11:00 AM – 1:00 PM", "bestTimeWait": 5,
      "openHours": "11:00 AM – 11:00 PM", "isFav": False,
      "reports": []
    }
  ],
  "reports": [],
  "users": [],
  "favorites": {}
}

def load_db():
  if not os.path.exists(DB_FILE):
    save_db(DEFAULT_DB)
    return DEFAULT_DB
  try:
    with open(DB_FILE, 'r', encoding='utf-8') as f:
      return json.load(f)
  except Exception as e:
    return DEFAULT_DB

def save_db(data):
  try:
    with open(DB_FILE, 'w', encoding='utf-8') as f:
      json.dump(data, f, indent=2)
  except Exception as e:
    print('DB Save Error:', e)

# Connected SSE Clients
sse_clients = []
sse_lock = threading.Lock()

def broadcast_event(event_type, payload):
  msg = f"event: {event_type}\ndata: {json.dumps(payload)}\n\n"
  with sse_lock:
    dead = []
    for w in sse_clients:
      try:
        w.write(msg.encode('utf-8'))
        w.flush()
      except Exception:
        dead.append(w)
    for d in dead:
      sse_clients.remove(d)

class RealtimeDBHandler(SimpleHTTPRequestHandler):
  def __init__(self, *args, **kwargs):
    super().__init__(*args, directory=os.path.dirname(__file__), **kwargs)

  def do_GET(self):
    if self.path.startswith('/api/db'):
      db_data = load_db()
      self.send_response(200)
      self.send_header('Content-Type', 'application/json')
      self.send_header('Access-Control-Allow-Origin', '*')
      self.end_headers()
      self.wfile.write(json.dumps(db_data).encode('utf-8'))
      return

    if self.path.startswith('/api/stream'):
      self.send_response(200)
      self.send_header('Content-Type', 'text/event-stream')
      self.send_header('Cache-Control', 'no-cache')
      self.send_header('Connection', 'keep-alive')
      self.send_header('Access-Control-Allow-Origin', '*')
      self.end_headers()

      with sse_lock:
        sse_clients.append(self.wfile)

      # Keep connection alive with heartbeat
      try:
        while True:
          time.sleep(15)
          self.wfile.write(b": heartbeat\n\n")
          self.wfile.flush()
      except Exception:
        with sse_lock:
          if self.wfile in sse_clients:
            sse_clients.remove(self.wfile)
      return

    super().do_GET()

  def do_POST(self):
    if self.path.startswith('/api/report'):
      content_length = int(self.headers.get('Content-Length', 0))
      body = self.rfile.read(content_length)
      data = json.loads(body.decode('utf-8'))

      db_data = load_db()
      venue_id = data.get('venueId')
      crowd = data.get('crowdLevel', 'Moderate')
      wait = data.get('waitTime', 10)
      comment = data.get('comment', '')

      # Update venue in DB
      for v in db_data['venues']:
        if v['id'] == venue_id:
          v['currentCrowd'] = crowd
          v['waitTime'] = wait
          if 'reports' not in v: v['reports'] = []
          v['reports'].insert(0, {
            'id': 'r_' + str(int(time.time()*1000)),
            'user': data.get('userName', 'Community Member'),
            'crowd': crowd,
            'wait': wait,
            'comment': comment,
            'ts': int(time.time()*1000)
          })
          break

      save_db(db_data)
      broadcast_event('report_added', data)

      self.send_response(200)
      self.send_header('Content-Type', 'application/json')
      self.send_header('Access-Control-Allow-Origin', '*')
      self.end_headers()
      self.wfile.write(json.dumps({'status': 'ok', 'message': 'Report saved & broadcasted'}).encode('utf-8'))
      return

    if self.path.startswith('/api/venue/add'):
      content_length = int(self.headers.get('Content-Length', 0))
      body = self.rfile.read(content_length)
      venue_data = json.loads(body.decode('utf-8'))

      db_data = load_db()
      db_data['venues'].insert(0, venue_data)
      save_db(db_data)

      broadcast_event('venue_added', venue_data)

      self.send_response(200)
      self.send_header('Content-Type', 'application/json')
      self.send_header('Access-Control-Allow-Origin', '*')
      self.end_headers()
      self.wfile.write(json.dumps({'status': 'ok', 'venue': venue_data}).encode('utf-8'))
      return

    self.send_error(404, 'Endpoint not found')

  def do_OPTIONS(self):
    self.send_response(200)
    self.send_header('Access-Control-Allow-Origin', '*')
    self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    self.send_header('Access-Control-Allow-Headers', 'Content-Type')
    self.end_headers()

if __name__ == '__main__':
  server = HTTPServer(('0.0.0.0', PORT), RealtimeDBHandler)
  print(f'[Server] CrowdPulse Real-Time Server running on http://0.0.0.0:{PORT}')
  server.serve_forever()

