from fastapi import APIRouter, status

from app.api.dependencies import UNAUTHORIZED, CurrentUserId, DbSession, not_found
from app.schemas.common import CreateChildRequest, DeleteRequest, MoveRequest, RenameRequest, StatusResponse
from app.schemas.subtask import ChangeStateRequest, SubtaskResponse
from app.services import subtask_service

router = APIRouter(prefix="/subtask", tags=["Subtask"], responses=UNAUTHORIZED)


@router.post(
    "/create",
    status_code=status.HTTP_201_CREATED,
    response_model=SubtaskResponse,
    summary="Создать подзадачу",
    responses=not_found("задача"),
)
async def create_subtask(request: CreateChildRequest, user_id: CurrentUserId, db: DbSession):
    """Добавляет невыполненную подзадачу в конец задачи `parentObjectId`."""
    return await subtask_service.create_subtask(db, user_id, request.parent_object_id, request.name)


@router.post("/rename", summary="Переименовать подзадачу", responses=not_found("подзадача"))
async def rename_subtask(request: RenameRequest, user_id: CurrentUserId, db: DbSession) -> StatusResponse:
    await subtask_service.rename_subtask(db, user_id, request.object_id, request.name)
    return StatusResponse()


@router.post("/state", summary="Отметить выполнение подзадачи", responses=not_found("подзадача"))
async def change_subtask_state(request: ChangeStateRequest, user_id: CurrentUserId, db: DbSession) -> StatusResponse:
    await subtask_service.change_subtask_state(db, user_id, request.subtask_id, request.state)
    return StatusResponse()


@router.post("/move", summary="Переместить подзадачу", responses=not_found("подзадача", "задача"))
async def move_subtask(request: MoveRequest, user_id: CurrentUserId, db: DbSession) -> StatusResponse:
    """Меняет порядок подзадачи в задаче или переносит её в другую задачу пользователя."""
    await subtask_service.move_subtask(
        db, user_id, request.moved_object_id, request.current_parent_object, request.current_position
    )
    return StatusResponse()


@router.post("/delete", summary="Удалить подзадачу", responses=not_found("подзадача"))
async def delete_subtask(request: DeleteRequest, user_id: CurrentUserId, db: DbSession) -> StatusResponse:
    await subtask_service.delete_subtask(db, user_id, request.object_id)
    return StatusResponse()
