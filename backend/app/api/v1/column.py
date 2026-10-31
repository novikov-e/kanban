from uuid import UUID

from fastapi import APIRouter, status

from app.api.dependencies import UNAUTHORIZED, CurrentUserId, DbSession, not_found
from app.schemas.column import ColumnResponse, ColumnUpdateRequest
from app.schemas.common import CreateNamedRequest
from app.services import column_service

router = APIRouter(tags=["Column"], responses=UNAUTHORIZED)


@router.post(
    "/boards/{board_id}/columns",
    status_code=status.HTTP_201_CREATED,
    response_model=ColumnResponse,
    summary="Создать колонку",
    responses=not_found("доска"),
)
async def create_column(board_id: UUID, request: CreateNamedRequest, user_id: CurrentUserId, db: DbSession):
    """Добавляет колонку в конец доски."""
    return await column_service.create_column(db, user_id, board_id, request.name)


@router.patch(
    "/columns/{column_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Изменить колонку",
    responses=not_found("колонка", "доска"),
)
async def update_column(column_id: UUID, request: ColumnUpdateRequest, user_id: CurrentUserId, db: DbSession) -> None:
    """Переименование, изменение порядка на доске и перенос на другую доску пользователя."""
    await column_service.update_column(db, user_id, column_id, request.name, request.board_id, request.index)


@router.delete(
    "/columns/{column_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Удалить колонку",
    responses=not_found("колонка"),
)
async def delete_column(column_id: UUID, user_id: CurrentUserId, db: DbSession) -> None:
    """Удаляет колонку вместе с задачами и подзадачами."""
    await column_service.delete_column(db, user_id, column_id)
