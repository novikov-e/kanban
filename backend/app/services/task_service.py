from typing import Any
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Column, Task
from app.services import crud, ordering
from app.services.ownership import column_owned_by, task_owned_by

DEFAULT_TASK_COLOR = 1

TASK_ORDER = ordering.OrderedChildren(
    entity="Task",
    id=Task.task_id,
    parent_id=Task.column_id,
    position=Task.task_position,
    deleted_at=Task.deleted_at,
    owned_by=task_owned_by,
    parent_entity="Column",
    parent_key=Column.column_id,
    parent_owned_by=column_owned_by,
)


async def create_task(session: AsyncSession, user_id: UUID, column_id: UUID, name: str) -> Task:
    task = Task(
        column_id=column_id,
        task_name=name,
        color=DEFAULT_TASK_COLOR,
        task_position=await ordering.next_position(session, TASK_ORDER, user_id, column_id),
    )
    return await crud.insert(session, task, empty_collections=("subtasks",))


async def update_task(
    session: AsyncSession,
    user_id: UUID,
    task_id: UUID,
    name: str | None = None,
    color: int | None = None,
    column_id: UUID | None = None,
    index: int | None = None,
) -> None:
    values: dict[str, Any] = {"task_name": name, "color": color}
    values = {key: value for key, value in values.items() if value is not None}
    await crud.update_by_id(session, Task.task_id, task_id, "Task", task_owned_by(user_id), **values)
    if column_id is not None or index is not None:
        await ordering.move(session, TASK_ORDER, user_id, task_id, column_id, index)


async def delete_task(session: AsyncSession, user_id: UUID, task_id: UUID) -> None:
    await ordering.soft_delete(session, TASK_ORDER, user_id, task_id)
