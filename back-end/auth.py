import http
import re

from flask import Blueprint, request
from werkzeug.security import generate_password_hash

from api_response import ApiResponse
from models import User, db

auth = Blueprint("auth", __name__)


@auth.route("/signup", methods=["POST"])
def signup():
    email = request.json.get("email")
    password = request.json.get("password")

    if not all([email, password]):
        return ApiResponse.get_error_response(
            "Please provide all required fields: email, password",
            http.HTTPStatus.BAD_REQUEST
        )

    pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    if not re.match(pattern, email):
        return ApiResponse.get_error_response(
            "Please provide a valid email",
            http.HTTPStatus.BAD_REQUEST
        )

    if len(password) < 6:
        return ApiResponse.get_error_response(
            "Please provide a valid password with at least 6 characters",
            http.HTTPStatus.BAD_REQUEST
        )

    user = User.query.filter_by(email=email).first()
    if user is not None:
        return ApiResponse.get_error_response(
            "User email has already been registered",
            http.HTTPStatus.BAD_REQUEST
        )

    new_user = User(email=email, password=generate_password_hash(password))
    try:
        db.session.add(new_user)
        db.session.commit()
    except Exception as e:
        return ApiResponse.get_error_response(str(e), http.HTTPStatus.INTERNAL_SERVER_ERROR)

    return ApiResponse.get_response(new_user.to_json(), http.HTTPStatus.CREATED)
