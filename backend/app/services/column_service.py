from uuid import UUID

from sqlalchemy import update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm.attributes import set_committed_value

from app.models import Column
from app.services import ordering

COLUMN_ORDER = ordering.OrderedChildren(
    id=Column.column_id, parent_id=Column.board_id, position=Column.column_position, deleted_at=Column.deleted_at
)


async def create_column(session: AsyncSession, board_id: UUID, name: str, position: int) -> Column:
    new_column = Column(
        board_id=board_id,
        column_name=name,
        column_position=position
    )
    session.add(new_column)
    await session.commit()
    await session.refresh(new_column)
    set_committed_value(new_column, "tasks", [])
    return new_column


async def rename_column(session: AsyncSession, column_id: UUID, new_name: str) -> None:
    stmt = update(Column).where(Column.column_id ==
                                column_id).values(column_name=new_name)
    await session.execute(stmt)
    await session.commit()


async def move_column(session: AsyncSession, column_id: UUID, board_id: UUID, position: int) -> bool:
    return await ordering.move(session, COLUMN_ORDER, column_id, board_id, position)


async def delete_column(session: AsyncSession, column_id: UUID) -> bool:
    return await ordering.soft_delete(session, COLUMN_ORDER, column_id)
