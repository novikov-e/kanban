from dataclasses import dataclass
from typing import Any
from uuid import UUID

from sqlalchemy import func, select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import InstrumentedAttribute


@dataclass(frozen=True)
class OrderedChildren:
    """Описание сущности, упорядоченной по позиции внутри родителя."""

    id: InstrumentedAttribute[Any]
    parent_id: InstrumentedAttribute[Any]
    position: InstrumentedAttribute[Any]
    deleted_at: InstrumentedAttribute[Any]

    @property
    def model(self) -> type:
        return self.id.class_


async def _get_parent_id(session: AsyncSession, spec: OrderedChildren, object_id: UUID) -> UUID | None:
    stmt = select(spec.parent_id).where(spec.id == object_id, spec.deleted_at.is_(None))
    return (await session.execute(stmt)).scalar_one_or_none()


async def _get_positions(session: AsyncSession, spec: OrderedChildren, parent_id: UUID) -> dict[UUID, int]:
    stmt = (
        select(spec.id, spec.position)
        .where(spec.parent_id == parent_id, spec.deleted_at.is_(None))
        .order_by(spec.position)
    )
    return {row[0]: row[1] for row in (await session.execute(stmt)).all()}


async def _save_order(
    session: AsyncSession, spec: OrderedChildren, ordered_ids: list[UUID], current: dict[UUID, int]
) -> None:
    for position, object_id in enumerate(ordered_ids):
        if current.get(object_id) != position:
            stmt = update(spec.model).where(spec.id == object_id).values({spec.position.key: position})
            await session.execute(stmt)


async def move(
    session: AsyncSession, spec: OrderedChildren, object_id: UUID, new_parent_id: UUID, new_position: int
) -> bool:
    old_parent_id = await _get_parent_id(session, spec, object_id)
    if old_parent_id is None:
        return False

    source = await _get_positions(session, spec, old_parent_id)
    source_ids = [i for i in source if i != object_id]

    if old_parent_id == new_parent_id:
        source_ids.insert(min(new_position, len(source_ids)), object_id)
        await _save_order(session, spec, source_ids, source)
    else:
        await _save_order(session, spec, source_ids, source)

        target = await _get_positions(session, spec, new_parent_id)
        target_ids = list(target)
        target_ids.insert(min(new_position, len(target_ids)), object_id)

        stmt = update(spec.model).where(spec.id == object_id).values({spec.parent_id.key: new_parent_id})
        await session.execute(stmt)
        await _save_order(session, spec, target_ids, target)

    await session.commit()
    return True


async def soft_delete(session: AsyncSession, spec: OrderedChildren, object_id: UUID) -> bool:
    parent_id = await _get_parent_id(session, spec, object_id)
    if parent_id is None:
        return False

    # Каскадное мягкое удаление дочерних сущностей выполняют триггеры в БД
    stmt = update(spec.model).where(spec.id == object_id).values({spec.deleted_at.key: func.now()})
    await session.execute(stmt)

    remaining = await _get_positions(session, spec, parent_id)
    await _save_order(session, spec, list(remaining), remaining)

    await session.commit()
    return True
