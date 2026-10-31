import hashlib
from typing import Any

from fastapi import Request, Response, status
from pydantic import BaseModel

NOT_MODIFIED: dict[int | str, dict[str, Any]] = {
    304: {"description": "Не изменилось с версии из заголовка `If-None-Match`; тело пустое"}
}


def json_with_etag(request: Request, payload: BaseModel) -> Response:
    """JSON-ответ с ETag от тела; 304, если клиент прислал тот же ETag в `If-None-Match`."""
    body = payload.model_dump_json(by_alias=True).encode()
    etag = f'"{hashlib.sha256(body).hexdigest()}"'
    headers = {"ETag": etag, "Cache-Control": "private, no-cache"}
    if etag in request.headers.get("If-None-Match", ""):
        return Response(status_code=status.HTTP_304_NOT_MODIFIED, headers=headers)
    return Response(content=body, media_type="application/json", headers=headers)
