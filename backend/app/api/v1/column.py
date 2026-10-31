from fastapi import APIRouter, status

from app.api.dependencies import DbSession, not_found
from app.schemas.column import ColumnResponse
from app.schemas.common import CreateChildRequest, DeleteRequest, MoveRequest, RenameRequest, StatusResponse
from app.services import column_service

router = APIRouter(prefix="/column", tags=["Column"])


@router.post(
    "/create",
    status_code=status.HTTP_201_CREATED,
    response_model=ColumnResponse,
    summary="Создать колонку",
    responses=not_found("доска"),
)
async def create_column(request: CreateChildRequest, db: DbSession):
    """Добавляет колонку в конец доски `parentObjectId`."""
    return await column_service.create_column(db, request.parent_object_id, request.name)


@router.post("/rename", summary="Переименовать колонку", responses=not_found("колонка"))
async def rename_column(request: RenameRequest, db: DbSession) -> StatusResponse:
    await column_service.rename_column(db, request.object_id, request.name)
    return StatusResponse()


@router.post("/move", summary="Переместить колонку", responses=not_found("колонка", "доска"))
async def move_column(request: MoveRequest, db: DbSession) -> StatusResponse:
    """Меняет порядок колонки на доске или переносит её на другую доску."""
    await column_service.move_column(
        db, request.moved_object_id, request.current_parent_object, request.current_position
    )
    return StatusResponse()


@router.post("/delete", summary="Удалить колонку", responses=not_found("колонка"))
async def delete_column(request: DeleteRequest, db: DbSession) -> StatusResponse:
    """Удаляет колонку вместе с задачами и подзадачами."""
    await column_service.delete_column(db, request.object_id)
    return StatusResponse()
