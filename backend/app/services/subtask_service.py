from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Subtask, Task
from app.services import crud, ordering

SUBTASK_ORDER = ordering.OrderedChildren(
    entity="Subtask",
    id=Subtask.subtask_id,
    parent_id=Subtask.task_id,
    position=Subtask.subtask_position,
    deleted_at=Subtask.deleted_at,
)


async def create_subtask(session: AsyncSession, task_id: UUID, name: str) -> Subtask:
    await crud.ensure_exists(session, Task.task_id, task_id, "Task")
    subtask = Subtask(
        task_id=task_id,
        subtask_name=name,
        subtask_state=False,
        subtask_position=await ordering.next_position(session, SUBTASK_ORDER, task_id),
    )
    return await crud.insert(session, subtask)


async def rename_subtask(session: AsyncSession, subtask_id: UUID, name: str) -> None:
    await crud.update_by_id(session, Subtask.subtask_id, subtask_id, "Subtask", subtask_name=name)


async def change_subtask_state(session: AsyncSession, subtask_id: UUID, state: bool) -> None:
    await crud.update_by_id(session, Subtask.subtask_id, subtask_id, "Subtask", subtask_state=state)


async def move_subtask(session: AsyncSession, subtask_id: UUID, task_id: UUID, position: int) -> None:
    await crud.ensure_exists(session, Task.task_id, task_id, "Task")
    await ordering.move(session, SUBTASK_ORDER, subtask_id, task_id, position)


async def delete_subtask(session: AsyncSession, subtask_id: UUID) -> None:
    await ordering.soft_delete(session, SUBTASK_ORDER, subtask_id)
