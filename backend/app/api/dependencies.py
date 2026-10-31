from typing import Annotated, Any
from uuid import UUID

from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.errors import AuthError
from app.core.security import TokenType, decode_token
from app.db.database import get_db
from app.schemas.common import ErrorResponse

DbSession = Annotated[AsyncSession, Depends(get_db)]

_bearer = HTTPBearer(auto_error=False, description="Access-токен из `/api/v1/auth/login` или `/refresh`")


def get_current_user_id(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(_bearer)],
) -> UUID:
    if credentials is None:
        raise AuthError("Not authenticated")
    return decode_token(credentials.credentials, TokenType.ACCESS).user_id


CurrentUserId = Annotated[UUID, Depends(get_current_user_id)]

UNAUTHORIZED: dict[int | str, dict[str, Any]] = {
    401: {"model": ErrorResponse, "description": "Нет access-токена, он недействителен или истёк"}
}


def not_found(*entities: str) -> dict[int | str, dict[str, Any]]:
    return {404: {"model": ErrorResponse, "description": f"Не найдено: {', '.join(entities)}"}}
