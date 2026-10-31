from uuid import UUID

from fastapi import APIRouter, status

from app.api.dependencies import UNAUTHORIZED, CurrentUserId, DbSession, not_found
from app.schemas.common import CreateNamedRequest
from app.schemas.subtask import SubtaskResponse, SubtaskUpdateRequest
from app.services import subtask_service

router = APIRouter(tags=["Subtask"], responses=UNAUTHORIZED)


@router.post(
    "/tasks/{task_id}/subtasks",
    status_code=status.HTTP_201_CREATED,
    response_model=SubtaskResponse,
    summary="Создать подзадачу",
    responses=not_found("задача"),
)
async def create_subtask(task_id: UUID, request: CreateNamedRequest, user_id: CurrentUserId, db: DbSession):
    """Добавляет невыполненную подзадачу в конец задачи."""
    return await subtask_service.create_subtask(db, user_id, task_id, request.name)


@router.patch(
    "/subtasks/{subtask_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Изменить подзадачу",
    responses=not_found("подзадача", "задача"),
)
async def update_subtask(
    subtask_id: UUID, request: SubtaskUpdateRequest, user_id: CurrentUserId, db: DbSession
) -> None:
    """Переименование, отметка о выполнении, изменение порядка и перенос в другую задачу пользователя."""
    await subtask_service.update_subtask(
        db, user_id, subtask_id, request.name, request.state, request.task_id, request.index
    )


@router.delete(
    "/subtasks/{subtask_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Удалить подзадачу",
    responses=not_found("подзадача"),
)
async def delete_subtask(subtask_id: UUID, user_id: CurrentUserId, db: DbSession) -> None:
    await subtask_service.delete_subtask(db, user_id, subtask_id)
