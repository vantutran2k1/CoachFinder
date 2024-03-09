from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate

from auth import auth
from models import *
from routes import routes

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://admin:password@localhost:5432/coach_finder"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SECRET_KEY"] = "helloworld"

app.register_blueprint(routes)
app.register_blueprint(auth)

CORS(app)

db.init_app(app)
migrate = Migrate(app, db)

if __name__ == "__main__":
    app.run(debug=False)
