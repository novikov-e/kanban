from typing import Any
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Subtask, Task
from app.services import crud, ordering
from app.services.ownership import subtask_owned_by, task_owned_by

SUBTASK_ORDER = ordering.OrderedChildren(
    entity="Subtask",
    id=Subtask.subtask_id,
    parent_id=Subtask.task_id,
    position=Subtask.subtask_position,
    deleted_at=Subtask.deleted_at,
    owned_by=subtask_owned_by,
    parent_entity="Task",
    parent_key=Task.task_id,
    parent_owned_by=task_owned_by,
)


async def create_subtask(session: AsyncSession, user_id: UUID, task_id: UUID, name: str) -> Subtask:
    subtask = Subtask(
        task_id=task_id,
        subtask_name=name,
        subtask_state=False,
        subtask_position=await ordering.next_position(session, SUBTASK_ORDER, user_id, task_id),
    )
    return await crud.insert(session, subtask)


async def update_subtask(
    session: AsyncSession,
    user_id: UUID,
    subtask_id: UUID,
    name: str | None = None,
    state: bool | None = None,
    task_id: UUID | None = None,
    index: int | None = None,
) -> None:
    values: dict[str, Any] = {"subtask_name": name, "subtask_state": state}
    values = {key: value for key, value in values.items() if value is not None}
    owned = subtask_owned_by(user_id)
    await crud.update_by_id(session, Subtask.subtask_id, subtask_id, "Subtask", owned, **values)
    if task_id is not None or index is not None:
        await ordering.move(session, SUBTASK_ORDER, user_id, subtask_id, task_id, index)


async def delete_subtask(session: AsyncSession, user_id: UUID, subtask_id: UUID) -> None:
    await ordering.soft_delete(session, SUBTASK_ORDER, user_id, subtask_id)
