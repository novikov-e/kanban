from typing import Annotated, Any

from fastapi import APIRouter, Cookie, Response, status

from app.api.dependencies import DbSession
from app.core.config import settings
from app.core.errors import AuthError
from app.core.security import ACCESS_TOKEN_TTL, REFRESH_TOKEN_TTL
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse
from app.schemas.common import ErrorResponse
from app.services import auth_service

REFRESH_COOKIE = "refresh_token"
REFRESH_COOKIE_PATH = "/api/v1/auth"

INVALID_CREDENTIALS: dict[int | str, dict[str, Any]] = {
    401: {"model": ErrorResponse, "description": "Неверный email или пароль"}
}
INVALID_REFRESH: dict[int | str, dict[str, Any]] = {
    401: {"model": ErrorResponse, "description": "Нет refresh-токена, он отозван или истёк"}
}

router = APIRouter(prefix="/auth", tags=["Auth"])

RefreshCookie = Annotated[str | None, Cookie(alias=REFRESH_COOKIE, include_in_schema=False)]


def _token_response(response: Response, tokens: auth_service.TokenPair) -> TokenResponse:
    response.set_cookie(
        REFRESH_COOKIE,
        tokens.refresh.value,
        max_age=int(REFRESH_TOKEN_TTL.total_seconds()),
        path=REFRESH_COOKIE_PATH,
        httponly=True,
        secure=settings.REFRESH_COOKIE_SECURE,
        samesite="strict",
    )
    return TokenResponse(access_token=tokens.access.value, expires_in=int(ACCESS_TOKEN_TTL.total_seconds()))


@router.post(
    "/register",
    status_code=status.HTTP_201_CREATED,
    summary="Регистрация",
    responses={409: {"model": ErrorResponse, "description": "Email уже зарегистрирован"}},
)
async def register(request: RegisterRequest, response: Response, db: DbSession) -> TokenResponse:
    """Создаёт пользователя и сразу выполняет вход."""
    tokens = await auth_service.register(db, request.email, request.password, request.firstname, request.lastname)
    return _token_response(response, tokens)


@router.post("/login", summary="Вход", responses=INVALID_CREDENTIALS)
async def login(request: LoginRequest, response: Response, db: DbSession) -> TokenResponse:
    """Возвращает access-токен и ставит refresh-токен в httpOnly cookie."""
    return _token_response(response, await auth_service.login(db, request.email, request.password))


@router.post("/refresh", summary="Обновить access-токен", responses=INVALID_REFRESH)
async def refresh(response: Response, db: DbSession, refresh_token: RefreshCookie = None) -> TokenResponse:
    """Обменивает refresh-токен из cookie на новую пару токенов; старый refresh-токен отзывается."""
    if refresh_token is None:
        raise AuthError("Refresh token is missing")
    return _token_response(response, await auth_service.refresh(db, refresh_token))


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT, summary="Выход")
async def logout(response: Response, db: DbSession, refresh_token: RefreshCookie = None) -> None:
    """Отзывает refresh-токен из cookie и удаляет cookie."""
    if refresh_token is not None:
        await auth_service.logout(db, refresh_token)
    response.delete_cookie(REFRESH_COOKIE, path=REFRESH_COOKIE_PATH)
