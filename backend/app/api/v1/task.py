from uuid import UUID

from fastapi import APIRouter, status

from app.api.dependencies import UNAUTHORIZED, CurrentUserId, DbSession, not_found
from app.schemas.common import CreateNamedRequest
from app.schemas.task import TaskResponse, TaskUpdateRequest
from app.services import task_service

router = APIRouter(tags=["Task"], responses=UNAUTHORIZED)


@router.post(
    "/columns/{column_id}/tasks",
    status_code=status.HTTP_201_CREATED,
    response_model=TaskResponse,
    summary="Создать задачу",
    responses=not_found("колонка"),
)
async def create_task(column_id: UUID, request: CreateNamedRequest, user_id: CurrentUserId, db: DbSession):
    """Добавляет задачу с нейтральным цветом в конец колонки."""
    return await task_service.create_task(db, user_id, column_id, request.name)


@router.patch(
    "/tasks/{task_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Изменить задачу",
    responses=not_found("задача", "колонка"),
)
async def update_task(task_id: UUID, request: TaskUpdateRequest, user_id: CurrentUserId, db: DbSession) -> None:
    """Переименование, смена цвета, изменение порядка в колонке и перенос в другую колонку пользователя."""
    await task_service.update_task(db, user_id, task_id, request.name, request.color, request.column_id, request.index)


@router.delete(
    "/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Удалить задачу", responses=not_found("задача")
)
async def delete_task(task_id: UUID, user_id: CurrentUserId, db: DbSession) -> None:
    """Удаляет задачу вместе с подзадачами."""
    await task_service.delete_task(db, user_id, task_id)
