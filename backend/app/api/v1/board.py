from uuid import UUID

from fastapi import APIRouter, Query, status

from app.api.dependencies import UNAUTHORIZED, CurrentUserId, DbSession, not_found
from app.schemas.board import BoardResponse
from app.schemas.common import DeleteRequest, RenameRequest, ReorderRequest, StatusResponse
from app.services import board_service

router = APIRouter(prefix="/board", tags=["Board"], responses=UNAUTHORIZED)


@router.get("", response_model=BoardResponse, summary="Доска целиком", responses=not_found("доска"))
async def get_board(
    user_id: CurrentUserId, db: DbSession, board_id: UUID = Query(alias="id", description="Идентификатор доски")
):
    """Доска со всеми колонками, задачами и подзадачами."""
    return await board_service.get_board(db, user_id, board_id)


@router.post("/create", status_code=status.HTTP_201_CREATED, response_model=BoardResponse, summary="Создать доску")
async def create_board(user_id: CurrentUserId, db: DbSession):
    """Создаёт доску с названием по умолчанию в конце списка досок пользователя."""
    return await board_service.create_board(db, user_id)


@router.post("/rename", summary="Переименовать доску", responses=not_found("доска"))
async def rename_board(request: RenameRequest, user_id: CurrentUserId, db: DbSession) -> StatusResponse:
    await board_service.rename_board(db, user_id, request.object_id, request.name)
    return StatusResponse()


@router.post("/move", summary="Изменить порядок доски", responses=not_found("доска"))
async def move_board(request: ReorderRequest, user_id: CurrentUserId, db: DbSession) -> StatusResponse:
    await board_service.move_board(db, user_id, request.moved_object_id, request.current_position)
    return StatusResponse()


@router.post("/delete", summary="Удалить доску", responses=not_found("доска"))
async def delete_board(request: DeleteRequest, user_id: CurrentUserId, db: DbSession) -> StatusResponse:
    """Удаляет доску вместе с колонками, задачами и подзадачами."""
    await board_service.delete_board(db, user_id, request.object_id)
    return StatusResponse()
