#from http.server import HTTPServer, BaseHTTPRequestHandler
import http.server
import socketserver
import urllib.error
import urllib.request
import socket

# Change when you use another wifi, it shows in the beginning on the arduino serial monitor
ESP_IP = "192.168.169.205"

PORT = 8000
class MyHttpRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/api/data":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            try:
                with urllib.request.urlopen(f"http://{ESP_IP}/data", timeout=2) as resp:
                    data = resp.read()
                self.wfile.write(data)
            except (urllib.error.URLError, socket.timeout, ConnectionError):
                self.wfile.write(b'{"error":"ESP32 not reachable"}')
            return

        # Otherwise serve index.html (and your JS/CSS)
        if self.path == "/":
            self.path = "Bot.html"
        return http.server.SimpleHTTPRequestHandler.do_GET(self)


Handler = MyHttpRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print("HTTP Server Serving at port", PORT)
    httpd.serve_forever()

# To expose server to internet, use ngrok:
# ngrok http 8000
# ctrl + C to stop the server
