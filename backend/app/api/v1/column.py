from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.schemas.column import ColumnResponse
from app.schemas.common import CreateObjectWithNameDto, DeleteObjectDto, MoveDto, RenameDto
from app.services import column_service

router = APIRouter(prefix="/api/v1/column", tags=["Column"])


def _not_found() -> HTTPException:
    return HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Column not found")


@router.post("/create", status_code=status.HTTP_201_CREATED, response_model=ColumnResponse)
async def create_column(dto: CreateObjectWithNameDto, db: AsyncSession = Depends(get_db)):
    return await column_service.create_column(db, dto.parent_object_id, dto.name, dto.position)


@router.post("/rename")
async def rename_column(dto: RenameDto, db: AsyncSession = Depends(get_db)):
    await column_service.rename_column(db, dto.object_id, dto.name)
    return {"status": "success"}


@router.post("/move")
async def move_column(dto: MoveDto, db: AsyncSession = Depends(get_db)):
    if not await column_service.move_column(db, dto.moved_object_id, dto.current_parent_object, dto.current_position):
        raise _not_found()
    return {"status": "success"}


@router.post("/delete")
async def delete_column(dto: DeleteObjectDto, db: AsyncSession = Depends(get_db)):
    if not await column_service.delete_column(db, dto.object_id):
        raise _not_found()
    return {"status": "success"}
