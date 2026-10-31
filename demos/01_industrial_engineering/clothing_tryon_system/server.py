#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Fashion AI Studio - Personal Design & AI Virtual Try-On
Lightweight Backend Service - Native Python 3 Standard Library, Zero External Dependencies
"""

import os
import sys
import json
import base64
import time
from urllib.parse import urlparse, parse_qs
from http.server import HTTPServer, SimpleHTTPRequestHandler

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, 'data')
UPLOAD_DIR = os.path.join(BASE_DIR, 'uploads')
DESIGNS_FILE = os.path.join(DATA_DIR, 'saved_designs.json')

os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(UPLOAD_DIR, exist_ok=True)

if not os.path.exists(DESIGNS_FILE):
    # Initialize sample design schemes
    initial_designs = [
        {
            "id": "design-170001",
            "name": "Minimalist Wool Trench Coat - Camel",
            "styleId": "trench_coat",
            "styleName": "Classic Double-Breasted Trench",
            "category": "outerwear",
            "colors": {
                "body": "#D2B48C",
                "collar": "#8B5A2B",
                "sleeves": "#D2B48C",
                "pockets": "#8B5A2B",
                "accents": "#2F1F17"
            },
            "materials": {
                "body": "wool",
                "collar": "leather"
            },
            "pattern": "solid",
            "fit": "regular",
            "createdAt": "2026-10-28 10:20",
            "tags": ["Business Casual", "Autumn Essential", "British Heritage"]
        },
        {
            "id": "design-170002",
            "name": "Cyberpunk Techwear Bomber Jacket - Onyx Black",
            "styleId": "bomber_jacket",
            "styleName": "Oversized Utility Flight Jacket",
            "category": "outerwear",
            "colors": {
                "body": "#1E232A",
                "collar": "#12151A",
                "sleeves": "#282F39",
                "pockets": "#00FF9D",
                "accents": "#00FF9D"
            },
            "materials": {
                "body": "techwear",
                "collar": "ribbed"
            },
            "pattern": "solid",
            "fit": "oversized",
            "createdAt": "2026-10-28 14:15",
            "tags": ["Techwear", "Cyberpunk", "Waterproof"]
        }
    ]
    with open(DESIGNS_FILE, 'w', encoding='utf-8') as f:
        json.dump(initial_designs, f, ensure_ascii=False, indent=2)

class FashionStudioHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def _send_json(self, status_code, data):
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path

        if path == '/api/health':
            self._send_json(200, {"status": "ok", "service": "Fashion AI Studio", "time": time.strftime("%Y-%m-%d %H:%M:%S")})
            return

        if path == '/api/designs':
            try:
                with open(DESIGNS_FILE, 'r', encoding='utf-8') as f:
                    designs = json.load(f)
                self._send_json(200, {"success": True, "data": designs})
            except Exception as e:
                self._send_json(500, {"success": False, "error": str(e)})
            return

        # Default static file handling
        super().do_GET()

    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path

        if path == '/api/designs':
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length).decode('utf-8')
            try:
                new_design = json.loads(body)
                if not new_design.get('id'):
                    new_design['id'] = f"design-{int(time.time()*1000)}"
                if not new_design.get('createdAt'):
                    new_design['createdAt'] = time.strftime("%Y-%m-%d %H:%M")

                with open(DESIGNS_FILE, 'r', encoding='utf-8') as f:
                    designs = json.load(f)

                # Update if ID matches, else append
                existing_idx = next((i for i, d in enumerate(designs) if d.get('id') == new_design['id']), None)
                if existing_idx is not None:
                    designs[existing_idx] = new_design
                else:
                    designs.insert(0, new_design)

                with open(DESIGNS_FILE, 'w', encoding='utf-8') as f:
                    json.dump(designs, f, ensure_ascii=False, indent=2)

                self._send_json(200, {"success": True, "data": new_design, "message": "Design saved successfully"})
            except Exception as e:
                self._send_json(400, {"success": False, "error": str(e)})
            return

        if path == '/api/upload_photo':
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length).decode('utf-8')
            try:
                payload = json.loads(body)
                image_data = payload.get('image', '')
                if ',' in image_data:
                    image_data = image_data.split(',', 1)[1]
                
                filename = f"user_photo_{int(time.time()*1000)}.png"
                filepath = os.path.join(UPLOAD_DIR, filename)
                with open(filepath, 'wb') as f:
                    f.write(base64.b64decode(image_data))

                self._send_json(200, {
                    "success": True, 
                    "url": f"/uploads/{filename}",
                    "filename": filename,
                    "message": "Photo uploaded and processed successfully"
                })
            except Exception as e:
                self._send_json(400, {"success": False, "error": str(e)})
            return

        self._send_json(404, {"error": "Not Found"})

    def do_DELETE(self):
        parsed = urlparse(self.path)
        path = parsed.path
        if path.startswith('/api/designs/'):
            design_id = path.replace('/api/designs/', '').strip()
            try:
                with open(DESIGNS_FILE, 'r', encoding='utf-8') as f:
                    designs = json.load(f)
                new_list = [d for d in designs if d.get('id') != design_id]
                with open(DESIGNS_FILE, 'w', encoding='utf-8') as f:
                    json.dump(new_list, f, ensure_ascii=False, indent=2)
                self._send_json(200, {"success": True, "message": "Design deleted successfully"})
            except Exception as e:
                self._send_json(500, {"success": False, "error": str(e)})
            return

        self._send_json(404, {"error": "Not Found"})

def run_server(port=8765):
    server_address = ('', port)
    httpd = HTTPServer(server_address, FashionStudioHandler)
    print(f"👗 Fashion AI Studio Backend Ready!")
    print(f"🌐 Local URL: http://127.0.0.1:{port}")
    print(f"📦 Working Directory: {BASE_DIR}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer shut down gracefully.")
        httpd.server_close()

if __name__ == '__main__':
    port = 8765
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            pass
    run_server(port)

