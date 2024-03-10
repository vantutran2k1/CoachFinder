import http
import re

from flask import Blueprint, request
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity, decode_token
from werkzeug.security import generate_password_hash, check_password_hash

from api_response import ApiResponse
from models import User, db

auth = Blueprint("auth", __name__, url_prefix="/auth")


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


@auth.route("/login", methods=["POST"])
def login():
    email = request.json.get("email")
    password = request.json.get("password")

    if not all([email, password]):
        return ApiResponse.get_error_response(
            "Please provide all required fields: email, password",
            http.HTTPStatus.BAD_REQUEST
        )

    user = User.query.filter_by(email=email).first()
    if user is None or not check_password_hash(user.password, password):
        return ApiResponse.get_error_response(
            "Invalid email or password. Check your login details and try again",
            http.HTTPStatus.UNAUTHORIZED
        )

    access_token = create_access_token(identity=user.email)
    refresh_token = create_refresh_token(identity=user.email)

    return ApiResponse.get_response(
        {
            "user_id": user.id,
            "email": user.email,
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_expiration": decode_token(refresh_token)['exp']
        },
        http.HTTPStatus.OK
    )


@auth.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def get_new_access_token():
    return ApiResponse.get_response(
        {
            "access_token": create_access_token(identity=get_jwt_identity()),
        },
        http.HTTPStatus.OK
    )
