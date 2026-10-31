from typing import Any
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.errors import NotFoundError
from app.models import Board, User
from app.services import crud
from app.services.ownership import board_owned_by


async def get_user(session: AsyncSession, user_id: UUID) -> User:
    stmt = (
        select(User)
        .where(User.id == user_id, User.deleted_at.is_(None))
        .options(selectinload(User.boards.and_(Board.deleted_at.is_(None))))
    )
    user = (await session.execute(stmt)).scalar_one_or_none()
    if user is None:
        raise NotFoundError("User")
    return user


async def update_user(session: AsyncSession, user_id: UUID, **values: Any) -> None:
    """Обновляет настройки пользователя: `dark_theme` и `last_board` (None — доска закрыта)."""
    if values.get("last_board") is not None:
        await crud.ensure_exists(session, Board.board_id, values["last_board"], "Board", board_owned_by(user_id))
    await crud.update_by_id(session, User.id, user_id, "User", User.id == user_id, **values)
