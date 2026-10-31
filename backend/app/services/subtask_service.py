from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Subtask, Task
from app.services import crud, ordering
from app.services.ownership import subtask_owned_by, task_owned_by

SUBTASK_ORDER = ordering.OrderedChildren(
    entity="Subtask",
    id=Subtask.subtask_id,
    parent_id=Subtask.task_id,
    parent_key=Task.task_id,
    position=Subtask.subtask_position,
    deleted_at=Subtask.deleted_at,
    owned_by=subtask_owned_by,
)


async def create_subtask(session: AsyncSession, user_id: UUID, task_id: UUID, name: str) -> Subtask:
    await crud.ensure_exists(session, Task.task_id, task_id, "Task", task_owned_by(user_id))
    subtask = Subtask(
        task_id=task_id,
        subtask_name=name,
        subtask_state=False,
        subtask_position=await ordering.next_position(session, SUBTASK_ORDER, task_id),
    )
    return await crud.insert(session, subtask)


async def rename_subtask(session: AsyncSession, user_id: UUID, subtask_id: UUID, name: str) -> None:
    owned = subtask_owned_by(user_id)
    await crud.update_by_id(session, Subtask.subtask_id, subtask_id, "Subtask", owned, subtask_name=name)


async def change_subtask_state(session: AsyncSession, user_id: UUID, subtask_id: UUID, state: bool) -> None:
    owned = subtask_owned_by(user_id)
    await crud.update_by_id(session, Subtask.subtask_id, subtask_id, "Subtask", owned, subtask_state=state)


async def move_subtask(session: AsyncSession, user_id: UUID, subtask_id: UUID, task_id: UUID, position: int) -> None:
    await crud.ensure_exists(session, Task.task_id, task_id, "Task", task_owned_by(user_id))
    await ordering.move(session, SUBTASK_ORDER, user_id, subtask_id, task_id, position)


async def delete_subtask(session: AsyncSession, user_id: UUID, subtask_id: UUID) -> None:
    await ordering.soft_delete(session, SUBTASK_ORDER, user_id, subtask_id)
