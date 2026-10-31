from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models import Board, User
from app.services import crud
from app.services.errors import NotFoundError


async def get_user_by_email(session: AsyncSession, email: str) -> User:
    stmt = (
        select(User)
        .where(User.email == email, User.deleted_at.is_(None))
        .options(selectinload(User.boards.and_(Board.deleted_at.is_(None))))
    )
    user = (await session.execute(stmt)).scalar_one_or_none()
    if user is None:
        raise NotFoundError("User")
    return user


async def update_theme(session: AsyncSession, user_id: UUID, dark_theme: bool) -> None:
    await crud.update_by_id(session, User.id, user_id, "User", dark_theme=dark_theme)


async def update_last_board(session: AsyncSession, user_id: UUID, board_id: UUID | None) -> None:
    await crud.update_by_id(session, User.id, user_id, "User", last_board=board_id)
