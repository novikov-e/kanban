from collections.abc import Callable
from dataclasses import dataclass
from typing import Any
from uuid import UUID

from sqlalchemy import ColumnElement, func, select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import InstrumentedAttribute

from app.core.errors import NotFoundError


@dataclass(frozen=True)
class OrderedChildren:
    """Сущность, упорядоченная по позиции внутри родителя."""

    entity: str
    id: InstrumentedAttribute[Any]
    parent_id: InstrumentedAttribute[Any]
    position: InstrumentedAttribute[Any]
    deleted_at: InstrumentedAttribute[Any]
    owned_by: Callable[[UUID], ColumnElement[bool]]

    @property
    def model(self) -> type:
        return self.id.class_


async def next_position(session: AsyncSession, spec: OrderedChildren, parent_id: UUID) -> int:
    stmt = select(func.count()).where(spec.parent_id == parent_id, spec.deleted_at.is_(None))
    return (await session.execute(stmt)).scalar_one()


async def move(
    session: AsyncSession,
    spec: OrderedChildren,
    user_id: UUID,
    object_id: UUID,
    new_parent_id: UUID,
    new_position: int,
) -> None:
    """Переносит объект и перенумеровывает затронутые списки без пропусков.

    Позиция за пределами списка означает вставку в конец.
    """
    old_parent_id = await _get_parent_id(session, spec, user_id, object_id)

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


async def soft_delete(session: AsyncSession, spec: OrderedChildren, user_id: UUID, object_id: UUID) -> None:
    parent_id = await _get_parent_id(session, spec, user_id, object_id)

    # Дочерние сущности помечают удалёнными триггеры БД
    stmt = update(spec.model).where(spec.id == object_id).values({spec.deleted_at.key: func.now()})
    await session.execute(stmt)

    remaining = await _get_positions(session, spec, parent_id)
    await _save_order(session, spec, list(remaining), remaining)

    await session.commit()


async def _get_parent_id(session: AsyncSession, spec: OrderedChildren, user_id: UUID, object_id: UUID) -> UUID:
    stmt = select(spec.parent_id).where(spec.id == object_id, spec.deleted_at.is_(None), spec.owned_by(user_id))
    parent_id = (await session.execute(stmt)).scalar_one_or_none()
    if parent_id is None:
        raise NotFoundError(spec.entity)
    return parent_id


async def _get_positions(session: AsyncSession, spec: OrderedChildren, parent_id: UUID) -> dict[UUID, int]:
    stmt = (
        select(spec.id, spec.position)
        .where(spec.parent_id == parent_id, spec.deleted_at.is_(None))
        .order_by(spec.position)
    )
    return {object_id: position for object_id, position in (await session.execute(stmt)).all()}


async def _save_order(
    session: AsyncSession, spec: OrderedChildren, ordered_ids: list[UUID], current: dict[UUID, int]
) -> None:
    for position, object_id in enumerate(ordered_ids):
        if current.get(object_id) != position:
            stmt = update(spec.model).where(spec.id == object_id).values({spec.position.key: position})
            await session.execute(stmt)
