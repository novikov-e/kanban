from fastapi import APIRouter, status

from app.api.dependencies import UNAUTHORIZED, CurrentUserId, DbSession, not_found
from app.schemas.user import UserResponse, UserUpdateRequest
from app.services import user_service

router = APIRouter(prefix="/users", tags=["User"], responses=UNAUTHORIZED)


@router.get("/me", response_model=UserResponse, summary="Текущий пользователь", responses=not_found("пользователь"))
async def get_me(user_id: CurrentUserId, db: DbSession):
    """Профиль пользователя, его настройки и список досок без содержимого."""
    return await user_service.get_user(db, user_id)


@router.patch(
    "/me",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Изменить настройки",
    responses=not_found("пользователь", "доска"),
)
async def update_me(request: UserUpdateRequest, user_id: CurrentUserId, db: DbSession) -> None:
    """Тема интерфейса и доска, которая откроется при следующем входе."""
    values = {}
    if request.dark_theme is not None:
        values["dark_theme"] = request.dark_theme
    if "last_board_id" in request.model_fields_set:
        values["last_board"] = request.last_board_id
    await user_service.update_user(db, user_id, **values)
