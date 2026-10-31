from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Board, Column
from app.services import crud, ordering
from app.services.ownership import board_owned_by, column_owned_by

COLUMN_ORDER = ordering.OrderedChildren(
    entity="Column",
    id=Column.column_id,
    parent_id=Column.board_id,
    position=Column.column_position,
    deleted_at=Column.deleted_at,
    owned_by=column_owned_by,
    parent_entity="Board",
    parent_key=Board.board_id,
    parent_owned_by=board_owned_by,
)


async def create_column(session: AsyncSession, user_id: UUID, board_id: UUID, name: str) -> Column:
    column = Column(
        board_id=board_id,
        column_name=name,
        column_position=await ordering.next_position(session, COLUMN_ORDER, user_id, board_id),
    )
    return await crud.insert(session, column, empty_collections=("tasks",))


async def update_column(
    session: AsyncSession,
    user_id: UUID,
    column_id: UUID,
    name: str | None = None,
    board_id: UUID | None = None,
    index: int | None = None,
) -> None:
    values = {"column_name": name} if name is not None else {}
    await crud.update_by_id(session, Column.column_id, column_id, "Column", column_owned_by(user_id), **values)
    if board_id is not None or index is not None:
        await ordering.move(session, COLUMN_ORDER, user_id, column_id, board_id, index)


async def delete_column(session: AsyncSession, user_id: UUID, column_id: UUID) -> None:
    await ordering.soft_delete(session, COLUMN_ORDER, user_id, column_id)
