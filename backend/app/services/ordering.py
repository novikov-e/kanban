from collections.abc import Callable
from dataclasses import dataclass
from typing import Any
from uuid import UUID

from sqlalchemy import ColumnElement, func, select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import InstrumentedAttribute

from app.core.errors import NotFoundError

POSITION_STEP = 1.0


@dataclass(frozen=True)
class OrderedChildren:
    """Сущность, упорядоченная по позиции внутри родителя.

    Позиции — числа с плавающей точкой, важен только их порядок. Перемещение ставит элемент в середину
    между соседями, поэтому меняет одну строку; промежутки периодически выравнивает `rebalance`.
    """

    entity: str
    id: InstrumentedAttribute[Any]
    parent_id: InstrumentedAttribute[Any]
    position: InstrumentedAttribute[Any]
    deleted_at: InstrumentedAttribute[Any]
    owned_by: Callable[[UUID], ColumnElement[bool]]
    parent_entity: str
    parent_key: InstrumentedAttribute[Any]
    parent_owned_by: Callable[[UUID], ColumnElement[bool]]

    @property
    def model(self) -> type:
        return self.id.class_


async def next_position(session: AsyncSession, spec: OrderedChildren, user_id: UUID, parent_id: UUID) -> float:
    """Позиция в конце списка `parent_id`; проверяет, что родитель принадлежит пользователю."""
    await _ensure_parent_owned(session, spec, user_id, parent_id)
    await _lock_parent(session, spec, parent_id)
    return await _position_at(session, spec, None, parent_id, None)


async def move(
    session: AsyncSession,
    spec: OrderedChildren,
    user_id: UUID,
    object_id: UUID,
    new_parent_id: UUID | None = None,
    new_index: int | None = None,
) -> None:
    """Ставит объект на место `new_index` в списке `new_parent_id`.

    Без родителя объект остаётся в текущем списке, без индекса — встаёт в конец; индекс за концом списка — тоже.
    """
    current_parent_id = await _ensure_owned(session, spec, user_id, object_id)
    parent_id = new_parent_id or current_parent_id
    if parent_id != current_parent_id:
        await _ensure_parent_owned(session, spec, user_id, parent_id)
    await _lock_parent(session, spec, parent_id)

    position = await _position_at(session, spec, object_id, parent_id, new_index)
    if position is None:
        await rebalance_parent(session, spec, parent_id)
        position = await _position_at(session, spec, object_id, parent_id, new_index)

    stmt = (
        update(spec.model)
        .where(spec.id == object_id)
        .values({spec.parent_id.key: parent_id, spec.position.key: position})
    )
    await session.execute(stmt)


async def soft_delete(session: AsyncSession, spec: OrderedChildren, user_id: UUID, object_id: UUID) -> None:
    await _ensure_owned(session, spec, user_id, object_id)
    # Дочерние сущности помечают удалёнными триггеры БД
    stmt = update(spec.model).where(spec.id == object_id).values({spec.deleted_at.key: func.now()})
    await session.execute(stmt)


async def rebalance_parent(session: AsyncSession, spec: OrderedChildren, parent_id: UUID) -> None:
    await _renumber(session, spec, spec.parent_id == parent_id)


async def rebalance(session: AsyncSession, spec: OrderedChildren) -> int:
    """Выравнивает позиции во всех списках сущности: 1, 2, 3… Возвращает число изменённых строк.

    Блокирует строки всех родителей, как и перемещения, чтобы они не вычисляли середину по старым позициям.
    """
    await session.execute(select(spec.parent_key).with_for_update())
    return await _renumber(session, spec)


async def _renumber(session: AsyncSession, spec: OrderedChildren, *conditions: ColumnElement[bool]) -> int:
    ranked = (
        select(
            spec.id.label("object_id"),
            (
                func.row_number().over(partition_by=spec.parent_id, order_by=(spec.position, spec.id)) * POSITION_STEP
            ).label("new_position"),
        )
        .where(spec.deleted_at.is_(None), *conditions)
        .subquery()
    )
    stmt = (
        update(spec.model)
        .where(spec.id == ranked.c.object_id, spec.position != ranked.c.new_position)
        .values({spec.position.key: ranked.c.new_position})
    )
    return (await session.execute(stmt)).rowcount


async def _position_at(
    session: AsyncSession, spec: OrderedChildren, object_id: UUID | None, parent_id: UUID, index: int | None
) -> float | None:
    """Позиция между соседями будущего места; None, если точности double между ними не хватает.

    `index=None` — место в конце списка.
    """
    is_sibling = [spec.parent_id == parent_id, spec.deleted_at.is_(None)]
    if object_id is not None:
        is_sibling.append(spec.id != object_id)
    siblings = select(spec.position).where(*is_sibling).order_by(spec.position, spec.id)
    if index == 0:
        return _between(None, (await session.execute(siblings.limit(1))).scalar_one_or_none())

    neighbours = [] if index is None else list((await session.execute(siblings.offset(index - 1).limit(2))).scalars())
    if not neighbours:
        last = (await session.execute(select(func.max(spec.position)).where(*is_sibling))).scalar_one_or_none()
        return _between(last, None)
    return _between(neighbours[0], neighbours[1] if len(neighbours) > 1 else None)


def _between(previous: float | None, following: float | None) -> float | None:
    if previous is None and following is None:
        return POSITION_STEP
    if following is None:
        return previous + POSITION_STEP
    if previous is None:
        return following / 2 if following > 0 else following - POSITION_STEP
    middle = (previous + following) / 2
    return middle if previous < middle < following else None


async def _ensure_owned(session: AsyncSession, spec: OrderedChildren, user_id: UUID, object_id: UUID) -> UUID:
    """Возвращает текущего родителя объекта."""
    stmt = select(spec.parent_id).where(spec.id == object_id, spec.deleted_at.is_(None), spec.owned_by(user_id))
    parent_id = (await session.execute(stmt)).scalar_one_or_none()
    if parent_id is None:
        raise NotFoundError(spec.entity)
    return parent_id


async def _ensure_parent_owned(session: AsyncSession, spec: OrderedChildren, user_id: UUID, parent_id: UUID) -> None:
    parent = spec.parent_key.class_
    stmt = select(spec.parent_key).where(
        spec.parent_key == parent_id, parent.deleted_at.is_(None), spec.parent_owned_by(user_id)
    )
    if (await session.execute(stmt)).scalar_one_or_none() is None:
        raise NotFoundError(spec.parent_entity)


async def _lock_parent(session: AsyncSession, spec: OrderedChildren, parent_id: UUID) -> None:
    """Сериализует изменения порядка в одном списке до конца транзакции."""
    await session.execute(select(spec.parent_key).where(spec.parent_key == parent_id).with_for_update())
