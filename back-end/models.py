from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Coach(db.Model):
    __tablename__ = 'coaches'

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(80), unique=False, nullable=False)
    last_name = db.Column(db.String(80), unique=False, nullable=False)
    description = db.Column(db.Text, unique=False, nullable=False)
    hourly_rate = db.Column(db.Integer, unique=False, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    areas = db.Column(db.Text, unique=False, nullable=False)


class Request(db.Model):
    __tablename__ = 'requests'

    id = db.Column(db.Integer, primary_key=True)
    coach_id = db.Column(db.Integer, db.ForeignKey('coaches.id'), unique=False, nullable=False)
    user_email = db.Column(db.String(120), unique=False, nullable=False)
    message = db.Column(db.Text, unique=False, nullable=False)
