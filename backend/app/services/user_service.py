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


async def update_theme(session: AsyncSession, user_id: UUID, dark_theme: bool) -> None:
    await crud.update_by_id(session, User.id, user_id, "User", User.id == user_id, dark_theme=dark_theme)


async def update_last_board(session: AsyncSession, user_id: UUID, board_id: UUID | None) -> None:
    if board_id is not None:
        await crud.ensure_exists(session, Board.board_id, board_id, "Board", board_owned_by(user_id))
    await crud.update_by_id(session, User.id, user_id, "User", User.id == user_id, last_board=board_id)
