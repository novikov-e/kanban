from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.schemas.common import CreateObjectWithNameDto, DeleteObjectDto, MoveDto, RenameDto
from app.schemas.task import ChangeColorDto, TaskResponse
from app.services import task_service

router = APIRouter(prefix="/api/v1/task_list",
                   tags=["Task (formerly TaskList)"])


def _not_found() -> HTTPException:
    return HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task list not found")


@router.post("/create", status_code=status.HTTP_201_CREATED, response_model=TaskResponse)
async def create_task(dto: CreateObjectWithNameDto, db: AsyncSession = Depends(get_db)):
    return await task_service.create_task(db, dto.parent_object_id, dto.name, dto.position)


@router.post("/rename")
async def rename_task(dto: RenameDto, db: AsyncSession = Depends(get_db)):
    await task_service.rename_task(db, dto.object_id, dto.name)
    return {"status": "success"}


@router.post("/color")
async def change_task_color(dto: ChangeColorDto, db: AsyncSession = Depends(get_db)):
    await task_service.change_task_color(db, dto.task_id, dto.color)
    return {"status": "success"}


@router.post("/move")
async def move_task(dto: MoveDto, db: AsyncSession = Depends(get_db)):
    if not await task_service.move_task(db, dto.moved_object_id, dto.current_parent_object, dto.current_position):
        raise _not_found()
    return {"status": "success"}


@router.post("/delete")
async def delete_task(dto: DeleteObjectDto, db: AsyncSession = Depends(get_db)):
    if not await task_service.delete_task(db, dto.object_id):
        raise _not_found()
    return {"status": "success"}
