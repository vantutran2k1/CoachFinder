import http

from flask import request, Blueprint

from api_response import ApiResponse
from models import Coach, db, Request

routes = Blueprint("routes", __name__)


@routes.route("/coaches", methods=["GET"])
def get_coaches():
    coaches = Coach.query.all()
    json_coaches = list(map(lambda coach: coach.to_json(), coaches))
    return ApiResponse.get_response(json_coaches, http.HTTPStatus.OK)


@routes.route("/coaches/<coach_id>", methods=["GET"])
def get_coach(coach_id):
    try:
        coach_id = int(coach_id)
    except ValueError:
        return ApiResponse.get_error_response("Invalid ID", http.HTTPStatus.BAD_REQUEST)

    coach = Coach.query.filter_by(id=coach_id).first()
    if coach is None:
        return ApiResponse.get_error_response(
            f"There are no coaches with id {coach_id}",
            http.HTTPStatus.NOT_FOUND
        )

    json_coach = coach.to_json()
    return ApiResponse.get_response(json_coach, http.HTTPStatus.OK)


@routes.route("/coaches", methods=["POST"])
def create_coach():
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


@routes.route("/requests", methods=["GET"])
def get_requests():
    coach_id = request.args.get("coach_id")
    if coach_id is None:
        requests = Request.query.all()
    else:
        requests = Request.query.filter_by(coach_id=coach_id).all()

    json_requests = list(map(lambda contact_request: contact_request.to_json(), requests))
    return ApiResponse.get_response(json_requests, http.HTTPStatus.OK)


@routes.route("/requests/<request_id>", methods=["GET"])
def get_request(request_id):
    try:
        request_id = int(request_id)
    except ValueError:
        return ApiResponse.get_error_response("Invalid ID", http.HTTPStatus.BAD_REQUEST)

    contact_request = Request.query.filter_by(id=request_id).first()
    if contact_request is None:
        return ApiResponse.get_error_response(
            f"There are no requests with id {request_id}",
            http.HTTPStatus.NOT_FOUND
        )

    json_request = contact_request.to_json()
    return ApiResponse.get_response(json_request, http.HTTPStatus.OK)


@routes.route("/requests", methods=["POST"])
def create_request():
    coach_id = request.json.get("coach_id")
    user_email = request.json.get("user_email")
    message = request.json.get("message")

    try:
        coach_id = int(coach_id)
    except ValueError:
        return ApiResponse.get_error_response(
            "Coach id must be an integer",
            http.HTTPStatus.BAD_REQUEST
        )

    if not all([coach_id, user_email, message]):
        return ApiResponse.get_error_response(
            "Please provide all required fields: coach_id, user_email, message",
            http.HTTPStatus.BAD_REQUEST
        )

    coach = Coach.query.filter_by(id=coach_id).first()
    if coach is None:
        return ApiResponse.get_error_response(
            "Coach with id {} does not exist".format(coach_id),
            http.HTTPStatus.NOT_FOUND
        )

    new_request = Request(
        coach_id=coach_id,
        user_email=user_email,
        message=message
    )
    try:
        db.session.add(new_request)
        db.session.commit()
    except Exception as e:
        return ApiResponse.get_error_response(str(e), http.HTTPStatus.INTERNAL_SERVER_ERROR)

    return ApiResponse.get_response(new_request.to_json(), http.HTTPStatus.CREATED)


@routes.errorhandler(http.HTTPStatus.NOT_FOUND)
def not_found_error(error):
    return ApiResponse.get_error_response("Not Found", http.HTTPStatus.NOT_FOUND)
