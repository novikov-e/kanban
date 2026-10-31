from uuid import UUID

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.errors import NotFoundError
from app.models import Board, Column, Subtask, Task, User
from app.services import crud, ordering
from app.services.ownership import board_owned_by

DEFAULT_BOARD_NAME = "Новый проект"

BOARD_ORDER = ordering.OrderedChildren(
    entity="Board",
    id=Board.board_id,
    parent_id=Board.user_id,
    position=Board.board_position,
    deleted_at=Board.deleted_at,
    owned_by=board_owned_by,
    parent_entity="User",
    parent_key=User.id,
    parent_owned_by=lambda user_id: User.id == user_id,
)


async def create_board(session: AsyncSession, user_id: UUID) -> Board:
    board = Board(
        user_id=user_id,
        board_name=DEFAULT_BOARD_NAME,
        board_position=await ordering.next_position(session, BOARD_ORDER, user_id, user_id),
    )
    return await crud.insert(session, board, empty_collections=("columns",))


async def get_board(session: AsyncSession, user_id: UUID, board_id: UUID) -> Board:
    stmt = (
        select(Board)
        .where(Board.board_id == board_id, Board.deleted_at.is_(None), board_owned_by(user_id))
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


async def update_board(
    session: AsyncSession, user_id: UUID, board_id: UUID, name: str | None = None, index: int | None = None
) -> None:
    values = {"board_name": name} if name is not None else {}
    await crud.update_by_id(session, Board.board_id, board_id, "Board", board_owned_by(user_id), **values)
    if index is not None:
        await ordering.move(session, BOARD_ORDER, user_id, board_id, new_index=index)


async def delete_board(session: AsyncSession, user_id: UUID, board_id: UUID) -> None:
    await session.execute(update(User).where(User.id == user_id, User.last_board == board_id).values(last_board=None))
    await ordering.soft_delete(session, BOARD_ORDER, user_id, board_id)
