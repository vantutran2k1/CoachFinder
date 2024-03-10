from datetime import timedelta

from flask import Flask

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://admin:password@localhost:5432/coach_finder"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SECRET_KEY"] = "helloworld"
app.config["JWT_SECRET_KEY"] = "helloworld"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=5)
