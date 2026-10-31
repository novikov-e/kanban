from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Board, Column
from app.services import crud, ordering

COLUMN_ORDER = ordering.OrderedChildren(
    entity="Column",
    id=Column.column_id,
    parent_id=Column.board_id,
    position=Column.column_position,
    deleted_at=Column.deleted_at,
)


async def create_column(session: AsyncSession, board_id: UUID, name: str) -> Column:
    await crud.ensure_exists(session, Board.board_id, board_id, "Board")
    column = Column(
        board_id=board_id,
        column_name=name,
        column_position=await ordering.next_position(session, COLUMN_ORDER, board_id),
    )
    return await crud.insert(session, column, empty_collections=("tasks",))


async def rename_column(session: AsyncSession, column_id: UUID, name: str) -> None:
    await crud.update_by_id(session, Column.column_id, column_id, "Column", column_name=name)


async def move_column(session: AsyncSession, column_id: UUID, board_id: UUID, position: int) -> None:
    await crud.ensure_exists(session, Board.board_id, board_id, "Board")
    await ordering.move(session, COLUMN_ORDER, column_id, board_id, position)


async def delete_column(session: AsyncSession, column_id: UUID) -> None:
    await ordering.soft_delete(session, COLUMN_ORDER, column_id)
