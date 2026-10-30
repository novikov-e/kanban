from uuid import UUID

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from sqlalchemy.orm.attributes import set_committed_value

from app.models import Board, Column, Subtask, Task
from app.services import ordering

BOARD_ORDER = ordering.OrderedChildren(
    id=Board.board_id, parent_id=Board.user_id, position=Board.board_position, deleted_at=Board.deleted_at
)


async def create_board(session: AsyncSession, user_id: UUID, position: int) -> Board:
    new_board = Board(
        user_id=user_id,
        board_name="Новый проект",
        board_position=position
    )
    session.add(new_board)
    await session.commit()
    await session.refresh(new_board)
    # У новой доски нет колонок: не даём сериализатору лениво ходить в БД вне async-контекста
    set_committed_value(new_board, "columns", [])
    return new_board


async def get_board_by_id_with_relations(session: AsyncSession, board_id: UUID) -> Board | None:
    # Порядок вложенных коллекций задаётся через order_by в relationship
    stmt = (
        select(Board)
        .where(Board.board_id == board_id, Board.deleted_at.is_(None))
        .options(
            selectinload(Board.columns.and_(Column.deleted_at.is_(None)))
            .selectinload(Column.tasks.and_(Task.deleted_at.is_(None)))
            .selectinload(Task.subtasks.and_(Subtask.deleted_at.is_(None)))
        )
    )
    result = await session.execute(stmt)
    return result.scalar_one_or_none()


async def rename_board(session: AsyncSession, board_id: UUID, new_name: str) -> None:
    stmt = update(Board).where(Board.board_id ==
                               board_id).values(board_name=new_name)
    await session.execute(stmt)
    await session.commit()


async def move_board(session: AsyncSession, board_id: UUID, user_id: UUID, position: int) -> bool:
    return await ordering.move(session, BOARD_ORDER, board_id, user_id, position)


async def delete_board(session: AsyncSession, board_id: UUID) -> bool:
    return await ordering.soft_delete(session, BOARD_ORDER, board_id)
