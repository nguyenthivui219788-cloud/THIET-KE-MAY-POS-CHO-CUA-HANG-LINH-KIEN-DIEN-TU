import http.server
import socketserver
import json
import base64
import os

PORT = 9999

class BillHandler(http.server.BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        # Enable CORS headers for development
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        if self.path == '/save-bill':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            try:
                data = json.loads(post_data.decode('utf-8'))
                image_data_uri = data.get('image')
                filename = data.get('filename') # e.g. "Ngày 2025-06-25/Đơn HD2545.png"
                
                # Sanitize path to prevent directory traversal
                filename = filename.replace('../', '').replace('..\\', '')
                
                # Target base directory: D:\Lịch sử giao dịch
                target_dir = r"D:\Lịch sử giao dịch"
                full_path = os.path.join(target_dir, filename)
                
                # Create subdirectories recursively if needed
                os.makedirs(os.path.dirname(full_path), exist_ok=True)
                
                # Strip out data url prefix if present
                if "," in image_data_uri:
                    header, encoded = image_data_uri.split(",", 1)
                else:
                    encoded = image_data_uri
                    
                image_bytes = base64.b64decode(encoded)
                
                # Save base64 image data to local D:\ drive path
                with open(full_path, "wb") as f:
                    f.write(image_bytes)
                    
                print(f"[SUCCESS] Hóa đơn đã được tự động lưu tại: {full_path}")
                
                # Send JSON response
                self.send_response(200)
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({
                    "status": "success", 
                    "path": full_path
                }).encode('utf-8'))
                
            except Exception as e:
                print(f"[ERROR] Không thể lưu hóa đơn: {e}")
                self.send_response(500)
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({
                    "status": "error", 
                    "message": str(e)
                }).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

# Run the local server
handler = BillHandler
with socketserver.TCPServer(("", PORT), handler) as httpd:
    print("=" * 60)
    print(f" TECHNO AUTO-SAVE SERVER RUNNING ON PORT {PORT}")
    print(f" Thư mục lưu hóa đơn mặc định: D:\\Lịch sử giao dịch\\")
    print(" Vui lòng KHÔNG đóng cửa sổ này khi thực hiện thanh toán/xuất ảnh")
    print("=" * 60)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nĐóng server.")
