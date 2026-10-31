from fastapi import APIRouter, status

from app.api.dependencies import DbSession, not_found
from app.schemas.common import CreateChildRequest, DeleteRequest, MoveRequest, RenameRequest, StatusResponse
from app.schemas.subtask import ChangeStateRequest, SubtaskResponse
from app.services import subtask_service

router = APIRouter(prefix="/subtask", tags=["Subtask"])


@router.post(
    "/create",
    status_code=status.HTTP_201_CREATED,
    response_model=SubtaskResponse,
    summary="Создать подзадачу",
    responses=not_found("задача"),
)
async def create_subtask(request: CreateChildRequest, db: DbSession):
    """Добавляет невыполненную подзадачу в конец задачи `parentObjectId`."""
    return await subtask_service.create_subtask(db, request.parent_object_id, request.name)


@router.post("/rename", summary="Переименовать подзадачу", responses=not_found("подзадача"))
async def rename_subtask(request: RenameRequest, db: DbSession) -> StatusResponse:
    await subtask_service.rename_subtask(db, request.object_id, request.name)
    return StatusResponse()


@router.post("/state", summary="Отметить выполнение подзадачи", responses=not_found("подзадача"))
async def change_subtask_state(request: ChangeStateRequest, db: DbSession) -> StatusResponse:
    await subtask_service.change_subtask_state(db, request.subtask_id, request.state)
    return StatusResponse()


@router.post("/move", summary="Переместить подзадачу", responses=not_found("подзадача", "задача"))
async def move_subtask(request: MoveRequest, db: DbSession) -> StatusResponse:
    """Меняет порядок подзадачи в задаче или переносит её в другую задачу."""
    await subtask_service.move_subtask(
        db, request.moved_object_id, request.current_parent_object, request.current_position
    )
    return StatusResponse()


@router.post("/delete", summary="Удалить подзадачу", responses=not_found("подзадача"))
async def delete_subtask(request: DeleteRequest, db: DbSession) -> StatusResponse:
    await subtask_service.delete_subtask(db, request.object_id)
    return StatusResponse()
