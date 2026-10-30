from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.schemas.board import BoardResponse
from app.schemas.common import CreateObjectDto, DeleteObjectDto, MoveDto, RenameDto
from app.services import board_service

router = APIRouter(prefix="/api/v1/project", tags=["Project/Board"])


def _not_found() -> HTTPException:
    return HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")


@router.get("", response_model=BoardResponse)
async def get_project(id: UUID = Query(...), db: AsyncSession = Depends(get_db)):
    board = await board_service.get_board_by_id_with_relations(db, id)
    if not board:
        raise _not_found()
    return board


@router.post("/create", status_code=status.HTTP_201_CREATED, response_model=BoardResponse)
async def create_project(dto: CreateObjectDto, db: AsyncSession = Depends(get_db)):
    return await board_service.create_board(db, dto.parent_object_id, dto.position)


@router.post("/rename")
async def rename_project(dto: RenameDto, db: AsyncSession = Depends(get_db)):
    await board_service.rename_board(db, dto.object_id, dto.name)
    return {"status": "success"}


@router.post("/move")
async def move_project(dto: MoveDto, db: AsyncSession = Depends(get_db)):
    if not await board_service.move_board(db, dto.moved_object_id, dto.current_parent_object, dto.current_position):
        raise _not_found()
    return {"status": "success"}


@router.post("/delete")
async def delete_project(dto: DeleteObjectDto, db: AsyncSession = Depends(get_db)):
    if not await board_service.delete_board(db, dto.object_id):
        raise _not_found()
    return {"status": "success"}
