from fastapi import APIRouter

from app.api.dependencies import UNAUTHORIZED, CurrentUserId, DbSession, not_found
from app.schemas.common import StatusResponse
from app.schemas.user import LastBoardUpdateRequest, ThemeUpdateRequest, UserResponse
from app.services import user_service

router = APIRouter(prefix="/user", tags=["User"], responses=UNAUTHORIZED)


@router.get("", response_model=UserResponse, summary="Текущий пользователь", responses=not_found("пользователь"))
async def get_user(user_id: CurrentUserId, db: DbSession):
    """Профиль пользователя, его настройки и список досок без содержимого."""
    return await user_service.get_user(db, user_id)


@router.post("/theme", summary="Переключить тему", responses=not_found("пользователь"))
async def update_theme(request: ThemeUpdateRequest, user_id: CurrentUserId, db: DbSession) -> StatusResponse:
    await user_service.update_theme(db, user_id, request.dark_theme)
    return StatusResponse()


@router.post("/last_board", summary="Запомнить открытую доску", responses=not_found("пользователь", "доска"))
async def update_last_board(request: LastBoardUpdateRequest, user_id: CurrentUserId, db: DbSession) -> StatusResponse:
    """Доска откроется автоматически при следующем входе."""
    await user_service.update_last_board(db, user_id, request.board_id)
    return StatusResponse()
