from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate

from auth import auth
from config import app
from models import db
from routes import routes

app.register_blueprint(routes)
app.register_blueprint(auth)
JWTManager(app)

CORS(app)

db.init_app(app)
migrate = Migrate(app, db)

if __name__ == "__main__":
    app.run(debug=False)
