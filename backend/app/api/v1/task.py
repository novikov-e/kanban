from fastapi import APIRouter, status

from app.api.dependencies import DbSession, not_found
from app.schemas.common import CreateChildRequest, DeleteRequest, MoveRequest, RenameRequest, StatusResponse
from app.schemas.task import ChangeColorRequest, TaskResponse
from app.services import task_service

router = APIRouter(prefix="/task", tags=["Task"])


@router.post(
    "/create",
    status_code=status.HTTP_201_CREATED,
    response_model=TaskResponse,
    summary="Создать задачу",
    responses=not_found("колонка"),
)
async def create_task(request: CreateChildRequest, db: DbSession):
    """Добавляет задачу в конец колонки `parentObjectId` с нейтральным цветом."""
    return await task_service.create_task(db, request.parent_object_id, request.name)


@router.post("/rename", summary="Переименовать задачу", responses=not_found("задача"))
async def rename_task(request: RenameRequest, db: DbSession) -> StatusResponse:
    await task_service.rename_task(db, request.object_id, request.name)
    return StatusResponse()


@router.post("/color", summary="Изменить цвет задачи", responses=not_found("задача"))
async def change_task_color(request: ChangeColorRequest, db: DbSession) -> StatusResponse:
    await task_service.change_task_color(db, request.task_id, request.color)
    return StatusResponse()


@router.post("/move", summary="Переместить задачу", responses=not_found("задача", "колонка"))
async def move_task(request: MoveRequest, db: DbSession) -> StatusResponse:
    """Меняет порядок задачи в колонке или переносит её в другую колонку."""
    await task_service.move_task(db, request.moved_object_id, request.current_parent_object, request.current_position)
    return StatusResponse()


@router.post("/delete", summary="Удалить задачу", responses=not_found("задача"))
async def delete_task(request: DeleteRequest, db: DbSession) -> StatusResponse:
    """Удаляет задачу вместе с подзадачами."""
    await task_service.delete_task(db, request.object_id)
    return StatusResponse()
