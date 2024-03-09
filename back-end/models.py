from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Coach(db.Model):
    __tablename__ = "coaches"

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(80), unique=False, nullable=False)
    last_name = db.Column(db.String(80), unique=False, nullable=False)
    description = db.Column(db.Text, unique=False, nullable=False)
    hourly_rate = db.Column(db.Integer, unique=False, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    areas = db.Column(db.Text, unique=False, nullable=False)

    def to_json(self):
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "description": self.description,
            "hourly_rate": self.hourly_rate,
            "email": self.email,
            "areas": self._convert_areas_to_json()
        }

    def _convert_areas_to_json(self) -> list[str]:
        return self.areas[1:-1].split(",")


class Request(db.Model):
    __tablename__ = "requests"

    id = db.Column(db.Integer, primary_key=True)
    coach_id = db.Column(db.Integer, db.ForeignKey("coaches.id"), unique=False, nullable=False)
    user_email = db.Column(db.String(120), unique=False, nullable=False)
    message = db.Column(db.Text, unique=False, nullable=False)

    def to_json(self):
        return {
            "id": self.id,
            "coach_id": self.coach_id,
            "user_email": self.user_email,
            "message": self.message
        }


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.Text, unique=False, nullable=False)

    def to_json(self):
        return {
            "id": self.id,
            "email": self.email
        }
