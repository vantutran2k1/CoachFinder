from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate

from models import *

app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://admin:password@localhost:5432/coach_finder"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)
migrate = Migrate(app, db)

if __name__ == '__main__':
    app.run(debug=False)
