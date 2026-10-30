from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.schemas.common import CreateObjectWithNameDto, DeleteObjectDto, MoveDto, RenameDto
from app.schemas.subtask import ChangeStateDto, SubtaskResponse
from app.services import subtask_service

router = APIRouter(prefix="/api/v1/subtask", tags=["Subtask"])


def _not_found() -> HTTPException:
    return HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Subtask not found")


@router.post("/create", status_code=status.HTTP_201_CREATED, response_model=SubtaskResponse)
async def create_subtask(dto: CreateObjectWithNameDto, db: AsyncSession = Depends(get_db)):
    return await subtask_service.create_subtask(db, dto.parent_object_id, dto.name, dto.position)


@router.post("/rename")
async def rename_subtask(dto: RenameDto, db: AsyncSession = Depends(get_db)):
    await subtask_service.rename_subtask(db, dto.object_id, dto.name)
    return {"status": "success"}


@router.post("/state")
async def change_state(dto: ChangeStateDto, db: AsyncSession = Depends(get_db)):
    await subtask_service.change_subtask_state(db, dto.subtask_id, dto.state)
    return {"status": "success"}


@router.post("/move")
async def move_subtask(dto: MoveDto, db: AsyncSession = Depends(get_db)):
    if not await subtask_service.move_subtask(db, dto.moved_object_id, dto.current_parent_object, dto.current_position):
        raise _not_found()
    return {"status": "success"}


@router.post("/delete")
async def delete_subtask(dto: DeleteObjectDto, db: AsyncSession = Depends(get_db)):
    if not await subtask_service.delete_subtask(db, dto.object_id):
        raise _not_found()
    return {"status": "success"}
