from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models import Board, Column, Subtask, Task, User
from app.services import crud, ordering
from app.services.errors import NotFoundError

DEFAULT_BOARD_NAME = "Новый проект"

BOARD_ORDER = ordering.OrderedChildren(
    entity="Board",
    id=Board.board_id,
    parent_id=Board.user_id,
    position=Board.board_position,
    deleted_at=Board.deleted_at,
)


async def create_board(session: AsyncSession, user_id: UUID) -> Board:
    await crud.ensure_exists(session, User.id, user_id, "User")
    board = Board(
        user_id=user_id,
        board_name=DEFAULT_BOARD_NAME,
        board_position=await ordering.next_position(session, BOARD_ORDER, user_id),
    )
    return await crud.insert(session, board, empty_collections=("columns",))


async def get_board(session: AsyncSession, board_id: UUID) -> Board:
    stmt = (
        select(Board)
        .where(Board.board_id == board_id, Board.deleted_at.is_(None))
        .options(
            selectinload(Board.columns.and_(Column.deleted_at.is_(None)))
            .selectinload(Column.tasks.and_(Task.deleted_at.is_(None)))
            .selectinload(Task.subtasks.and_(Subtask.deleted_at.is_(None)))
        )
    )
    board = (await session.execute(stmt)).scalar_one_or_none()
    if board is None:
        raise NotFoundError("Board")
    return board


async def rename_board(session: AsyncSession, board_id: UUID, name: str) -> None:
    await crud.update_by_id(session, Board.board_id, board_id, "Board", board_name=name)


async def move_board(session: AsyncSession, board_id: UUID, user_id: UUID, position: int) -> None:
    await crud.ensure_exists(session, User.id, user_id, "User")
    await ordering.move(session, BOARD_ORDER, board_id, user_id, position)


async def delete_board(session: AsyncSession, board_id: UUID) -> None:
    await ordering.soft_delete(session, BOARD_ORDER, board_id)
