from uuid import UUID

from sqlalchemy import update
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Subtask
from app.services import ordering

SUBTASK_ORDER = ordering.OrderedChildren(
    id=Subtask.subtask_id, parent_id=Subtask.task_id, position=Subtask.subtask_position, deleted_at=Subtask.deleted_at
)


async def create_subtask(session: AsyncSession, task_id: UUID, name: str, position: int) -> Subtask:
    new_subtask = Subtask(
        task_id=task_id,
        subtask_name=name,
        subtask_state=False,
        subtask_position=position
    )
    session.add(new_subtask)
    await session.commit()
    await session.refresh(new_subtask)
    return new_subtask


async def rename_subtask(session: AsyncSession, subtask_id: UUID, new_name: str) -> None:
    stmt = update(Subtask).where(Subtask.subtask_id ==
                                 subtask_id).values(subtask_name=new_name)
    await session.execute(stmt)
    await session.commit()


async def change_subtask_state(session: AsyncSession, subtask_id: UUID, state: bool) -> None:
    stmt = update(Subtask).where(Subtask.subtask_id ==
                                 subtask_id).values(subtask_state=state)
    await session.execute(stmt)
    await session.commit()


async def move_subtask(session: AsyncSession, subtask_id: UUID, task_id: UUID, position: int) -> bool:
    return await ordering.move(session, SUBTASK_ORDER, subtask_id, task_id, position)


async def delete_subtask(session: AsyncSession, subtask_id: UUID) -> bool:
    return await ordering.soft_delete(session, SUBTASK_ORDER, subtask_id)
