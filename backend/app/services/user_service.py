from typing import Any
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.errors import BadRequestError, ConflictError, NotFoundError
from app.core.security import hash_password, verify_password
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
    """Обновляет переданные поля. `last_board=None` закрывает доску, чужая доска — ошибка."""
    if values.get("last_board") is not None:
        await crud.ensure_exists(session, Board.board_id, values["last_board"], "Board", board_owned_by(user_id))
    if "email" in values:
        taken = await session.scalar(
            select(User.id).where(User.email == values["email"], User.id != user_id, User.deleted_at.is_(None))
        )
        if taken is not None:
            raise ConflictError("Email already registered")
    await crud.update_by_id(session, User.id, user_id, "User", User.id == user_id, **values)


async def replace_password(session: AsyncSession, user_id: UUID, current: str | None, new: str) -> str:
    """Проверяет текущий пароль и возвращает хеш нового. Неверный текущий — 400, не 401: сессия ещё жива."""
    if not current:
        raise BadRequestError("Current password is required")
    hashed = await session.scalar(select(User.password).where(User.id == user_id, User.deleted_at.is_(None)))
    if hashed is None:
        raise NotFoundError("User")
    if not verify_password(current, hashed):
        raise BadRequestError("Current password is incorrect")
    return hash_password(new)
