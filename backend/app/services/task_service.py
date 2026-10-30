from uuid import UUID

from sqlalchemy import update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm.attributes import set_committed_value

from app.models import Task
from app.services import ordering

TASK_ORDER = ordering.OrderedChildren(
    id=Task.task_id, parent_id=Task.column_id, position=Task.task_position, deleted_at=Task.deleted_at
)


async def create_task(session: AsyncSession, column_id: UUID, name: str, position: int) -> Task:
    new_task = Task(
        column_id=column_id,
        task_name=name,
        color=1,  # Дефолтный цвет
        task_position=position
    )
    session.add(new_task)
    await session.commit()
    await session.refresh(new_task)
    set_committed_value(new_task, "subtasks", [])
    return new_task


async def rename_task(session: AsyncSession, task_id: UUID, new_name: str) -> None:
    stmt = update(Task).where(Task.task_id ==
                              task_id).values(task_name=new_name)
    await session.execute(stmt)
    await session.commit()


async def change_task_color(session: AsyncSession, task_id: UUID, color: int) -> None:
    stmt = update(Task).where(Task.task_id == task_id).values(color=color)
    await session.execute(stmt)
    await session.commit()


async def move_task(session: AsyncSession, task_id: UUID, column_id: UUID, position: int) -> bool:
    return await ordering.move(session, TASK_ORDER, task_id, column_id, position)


async def delete_task(session: AsyncSession, task_id: UUID) -> bool:
    return await ordering.soft_delete(session, TASK_ORDER, task_id)
