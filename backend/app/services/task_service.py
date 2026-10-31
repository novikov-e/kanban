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
)


async def create_task(session: AsyncSession, user_id: UUID, column_id: UUID, name: str) -> Task:
    await crud.ensure_exists(session, Column.column_id, column_id, "Column", column_owned_by(user_id))
    task = Task(
        column_id=column_id,
        task_name=name,
        color=DEFAULT_TASK_COLOR,
        task_position=await ordering.next_position(session, TASK_ORDER, column_id),
    )
    return await crud.insert(session, task, empty_collections=("subtasks",))


async def rename_task(session: AsyncSession, user_id: UUID, task_id: UUID, name: str) -> None:
    await crud.update_by_id(session, Task.task_id, task_id, "Task", task_owned_by(user_id), task_name=name)


async def change_task_color(session: AsyncSession, user_id: UUID, task_id: UUID, color: int) -> None:
    await crud.update_by_id(session, Task.task_id, task_id, "Task", task_owned_by(user_id), color=color)


async def move_task(session: AsyncSession, user_id: UUID, task_id: UUID, column_id: UUID, position: int) -> None:
    await crud.ensure_exists(session, Column.column_id, column_id, "Column", column_owned_by(user_id))
    await ordering.move(session, TASK_ORDER, user_id, task_id, column_id, position)


async def delete_task(session: AsyncSession, user_id: UUID, task_id: UUID) -> None:
    await ordering.soft_delete(session, TASK_ORDER, user_id, task_id)
