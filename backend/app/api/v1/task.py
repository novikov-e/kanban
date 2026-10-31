from fastapi import APIRouter, status

from app.api.dependencies import UNAUTHORIZED, CurrentUserId, DbSession, not_found
from app.schemas.common import CreateChildRequest, DeleteRequest, MoveRequest, RenameRequest, StatusResponse
from app.schemas.task import ChangeColorRequest, TaskResponse
from app.services import task_service

router = APIRouter(prefix="/task", tags=["Task"], responses=UNAUTHORIZED)


@router.post(
    "/create",
    status_code=status.HTTP_201_CREATED,
    response_model=TaskResponse,
    summary="Создать задачу",
    responses=not_found("колонка"),
)
async def create_task(request: CreateChildRequest, user_id: CurrentUserId, db: DbSession):
    """Добавляет задачу в конец колонки `parentObjectId` с нейтральным цветом."""
    return await task_service.create_task(db, user_id, request.parent_object_id, request.name)


@router.post("/rename", summary="Переименовать задачу", responses=not_found("задача"))
async def rename_task(request: RenameRequest, user_id: CurrentUserId, db: DbSession) -> StatusResponse:
    await task_service.rename_task(db, user_id, request.object_id, request.name)
    return StatusResponse()


@router.post("/color", summary="Изменить цвет задачи", responses=not_found("задача"))
async def change_task_color(request: ChangeColorRequest, user_id: CurrentUserId, db: DbSession) -> StatusResponse:
    await task_service.change_task_color(db, user_id, request.task_id, request.color)
    return StatusResponse()


@router.post("/move", summary="Переместить задачу", responses=not_found("задача", "колонка"))
async def move_task(request: MoveRequest, user_id: CurrentUserId, db: DbSession) -> StatusResponse:
    """Меняет порядок задачи в колонке или переносит её в другую колонку пользователя."""
    await task_service.move_task(
        db, user_id, request.moved_object_id, request.current_parent_object, request.current_position
    )
    return StatusResponse()


@router.post("/delete", summary="Удалить задачу", responses=not_found("задача"))
async def delete_task(request: DeleteRequest, user_id: CurrentUserId, db: DbSession) -> StatusResponse:
    """Удаляет задачу вместе с подзадачами."""
    await task_service.delete_task(db, user_id, request.object_id)
    return StatusResponse()
