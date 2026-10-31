from uuid import UUID

from fastapi import APIRouter, Query, status

from app.api.dependencies import DbSession, not_found
from app.schemas.board import BoardResponse, CreateBoardRequest
from app.schemas.common import DeleteRequest, MoveRequest, RenameRequest, StatusResponse
from app.services import board_service

router = APIRouter(prefix="/board", tags=["Board"])


@router.get("", response_model=BoardResponse, summary="Доска целиком", responses=not_found("доска"))
async def get_board(db: DbSession, board_id: UUID = Query(alias="id", description="Идентификатор доски")):
    """Доска со всеми колонками, задачами и подзадачами."""
    return await board_service.get_board(db, board_id)


@router.post(
    "/create",
    status_code=status.HTTP_201_CREATED,
    response_model=BoardResponse,
    summary="Создать доску",
    responses=not_found("пользователь"),
)
async def create_board(request: CreateBoardRequest, db: DbSession):
    return await board_service.create_board(db, request.parent_object_id)


@router.post("/rename", summary="Переименовать доску", responses=not_found("доска"))
async def rename_board(request: RenameRequest, db: DbSession) -> StatusResponse:
    await board_service.rename_board(db, request.object_id, request.name)
    return StatusResponse()


@router.post("/move", summary="Переместить доску", responses=not_found("доска", "пользователь"))
async def move_board(request: MoveRequest, db: DbSession) -> StatusResponse:
    """Меняет порядок доски в списке пользователя или передаёт её другому пользователю."""
    await board_service.move_board(db, request.moved_object_id, request.current_parent_object, request.current_position)
    return StatusResponse()


@router.post("/delete", summary="Удалить доску", responses=not_found("доска"))
async def delete_board(request: DeleteRequest, db: DbSession) -> StatusResponse:
    """Удаляет доску вместе с колонками, задачами и подзадачами."""
    await board_service.delete_board(db, request.object_id)
    return StatusResponse()
