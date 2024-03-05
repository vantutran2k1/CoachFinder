import http

from flask import Flask, request
from flask_cors import CORS
from flask_migrate import Migrate

from api_response import ApiResponse
from models import *

app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://admin:password@localhost:5432/coach_finder"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)
migrate = Migrate(app, db)


@app.route("/coaches", methods=["GET"])
def get_coaches():
    coaches = Coach.query.all()
    json_coaches = list(map(lambda coach: coach.to_json(), coaches))
    return ApiResponse.get_response(json_coaches, http.HTTPStatus.OK)


@app.route("/coaches/<coach_id>", methods=["GET"])
def get_coach(coach_id):
    try:
        coach_id = int(coach_id)
    except ValueError:
        return ApiResponse.get_error_response("Invalid ID", http.HTTPStatus.BAD_REQUEST)

    coach = Coach.query.filter_by(id=coach_id).first()
    if coach is None:
        return ApiResponse.get_error_response(f"There are no coach with id {coach_id}", http.HTTPStatus.NOT_FOUND)

    json_coach = coach.to_json()
    return ApiResponse.get_response(json_coach, http.HTTPStatus.OK)


@app.route("/coaches", methods=["POST"])
def create_coaches():
    first_name = request.json.get("first_name")
    last_name = request.json.get("last_name")
    description = request.json.get("description")
    hourly_rate = request.json.get("hourly_rate")
    email = request.json.get("email")
    areas = request.json.get("areas")

    if not all([first_name, last_name, description, hourly_rate, email, areas]):
        return ApiResponse.get_error_response(
            "Please provide all required fields: first_name, last_name, description, hourly_rate, email, areas",
            http.HTTPStatus.BAD_REQUEST
        )

    coach = Coach.query.filter_by(email=email).first()
    if coach is not None:
        return ApiResponse.get_error_response(
            "Coach email has already been registered",
            http.HTTPStatus.BAD_REQUEST
        )

    if not isinstance(areas, list) or len(areas) == 0:
        return ApiResponse.get_error_response(
            "Areas field must be a list with at least one value",
            http.HTTPStatus.BAD_REQUEST
        )

    new_coach = Coach(
        first_name=first_name,
        last_name=last_name,
        description=description,
        hourly_rate=hourly_rate,
        email=email,
        areas=areas
    )
    try:
        db.session.add(new_coach)
        db.session.commit()
    except Exception as e:
        return ApiResponse.get_error_response(str(e), http.HTTPStatus.INTERNAL_SERVER_ERROR)

    return ApiResponse.get_response(new_coach.to_json(), http.HTTPStatus.CREATED)


@app.errorhandler(http.HTTPStatus.NOT_FOUND)
def not_found_error(error):
    return ApiResponse.get_error_response("Not Found", http.HTTPStatus.NOT_FOUND)


if __name__ == "__main__":
    app.run(debug=False)
