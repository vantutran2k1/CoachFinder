from typing import Any

from flask import jsonify, Response


class ApiResponse:
    @classmethod
    def get_response(cls, data: Any, status_code: int) -> (Response, int):
        return jsonify({"data": data}), status_code

    @classmethod
    def get_error_response(cls, message: str, status_code: int) -> (Response, int):
        return jsonify({"error": message}), status_code
