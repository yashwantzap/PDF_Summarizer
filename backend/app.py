from flask import Flask
from flask_cors import CORS
import os


BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def create_app():
    app = Flask(__name__)
    CORS(app)

    app.config['UPLOAD_FOLDER'] = os.path.join(BASE_DIR, 'uploads')
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])

    from routes.upload_download_routes import upload_bp
    app.register_blueprint(upload_bp)

    @app.route('/')
    def home():
        return "PDF Upload API is running. Use POST /upload to send documents."

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(port=5000)
