from flask import Flask
from flask_cors import CORS
import os
from routes.upload_download_routes import upload_bp

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def create_app():
    app = Flask(__name__)
    CORS(app)

    app.config['UPLOAD_FOLDER'] = os.path.join(BASE_DIR, 'uploads')
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])

    app.register_blueprint(upload_bp)

    @app.route('/')
    def home():
        return "Secure Document Upload API is running. Use POST /secure-upload to send documents."

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(port=5000, debug=True)
