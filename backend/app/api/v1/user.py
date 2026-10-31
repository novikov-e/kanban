from fastapi import APIRouter

from app.api.dependencies import DbSession, not_found
from app.core.config import settings
from app.schemas.common import StatusResponse
from app.schemas.user import LastBoardUpdateRequest, ThemeUpdateRequest, UserResponse
from app.services import user_service

router = APIRouter(prefix="/user", tags=["User"])


@router.get("", response_model=UserResponse, summary="Текущий пользователь", responses=not_found("пользователь"))
async def get_user(db: DbSession):
    """Профиль пользователя, его настройки и список досок без содержимого."""
    return await user_service.get_user_by_email(db, settings.DEFAULT_USER_EMAIL)


@router.post("/theme", summary="Переключить тему", responses=not_found("пользователь"))
async def update_theme(request: ThemeUpdateRequest, db: DbSession) -> StatusResponse:
    await user_service.update_theme(db, request.id, request.dark_theme)
    return StatusResponse()


@router.post("/last_board", summary="Запомнить открытую доску", responses=not_found("пользователь"))
async def update_last_board(request: LastBoardUpdateRequest, db: DbSession) -> StatusResponse:
    """Доска откроется автоматически при следующем входе."""
    await user_service.update_last_board(db, request.user_id, request.board_id)
    return StatusResponse()
