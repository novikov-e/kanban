from fastapi import APIRouter, status

from app.api.dependencies import UNAUTHORIZED, CurrentUserId, DbSession, not_found
from app.schemas.common import ErrorResponse
from app.schemas.user import UserResponse, UserUpdateRequest
from app.services import user_service

router = APIRouter(prefix="/users", tags=["User"], responses=UNAUTHORIZED)

PROFILE_FIELDS = ("firstname", "lastname", "date_of_birth", "sex")


@router.get("/me", response_model=UserResponse, summary="Текущий пользователь", responses=not_found("пользователь"))
async def get_me(user_id: CurrentUserId, db: DbSession):
    """Профиль пользователя, его настройки и список досок без содержимого."""
    return await user_service.get_user(db, user_id)


@router.patch(
    "/me",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Изменить профиль и настройки",
    responses={
        **not_found("пользователь", "доска"),
        400: {"model": ErrorResponse, "description": "Для смены пароля нужен верный текущий пароль"},
        409: {"model": ErrorResponse, "description": "Email уже зарегистрирован"},
    },
)
async def update_me(request: UserUpdateRequest, user_id: CurrentUserId, db: DbSession) -> None:
    """Профиль, пароль, тема и доска, которая откроется при следующем входе."""
    values = {}
    if request.dark_theme is not None:
        values["dark_theme"] = request.dark_theme
    if "last_board_id" in request.model_fields_set:
        values["last_board"] = request.last_board_id
    for field in PROFILE_FIELDS:
        if field in request.model_fields_set:
            value = getattr(request, field)
            values[field] = value.strip() or None if isinstance(value, str) else value
    if "email" in request.model_fields_set and request.email is not None:
        values["email"] = request.email.lower()
    if request.new_password:
        values["password"] = await user_service.replace_password(
            db, user_id, request.current_password, request.new_password
        )
    await user_service.update_user(db, user_id, **values)
