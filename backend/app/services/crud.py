from typing import Any
from uuid import UUID

from sqlalchemy import ColumnElement, select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import InstrumentedAttribute
from sqlalchemy.orm.attributes import set_committed_value

from app.core.errors import NotFoundError
from app.db.database import Base


async def ensure_exists(
    session: AsyncSession,
    id_column: InstrumentedAttribute[Any],
    object_id: UUID,
    entity: str,
    owned: ColumnElement[bool],
) -> None:
    model = id_column.class_
    stmt = select(id_column).where(id_column == object_id, model.deleted_at.is_(None), owned)
    if (await session.execute(stmt)).scalar_one_or_none() is None:
        raise NotFoundError(entity)


async def update_by_id(
    session: AsyncSession,
    id_column: InstrumentedAttribute[Any],
    object_id: UUID,
    entity: str,
    owned: ColumnElement[bool],
    **values: Any,
) -> None:
    model = id_column.class_
    stmt = update(model).where(id_column == object_id, model.deleted_at.is_(None), owned).values(**values)
    result = await session.execute(stmt)
    if result.rowcount == 0:
        raise NotFoundError(entity)
    await session.commit()


async def insert[ModelT: Base](session: AsyncSession, obj: ModelT, empty_collections: tuple[str, ...] = ()) -> ModelT:
    session.add(obj)
    await session.commit()
    await session.refresh(obj)
    # Без явного значения сериализатор попытается лениво загрузить коллекции вне async-контекста
    for collection in empty_collections:
        set_committed_value(obj, collection, [])
    return obj
