from datetime import date
from uuid import UUID

from sqlalchemy import func, select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models import Board, User


async def get_user_by_email(session: AsyncSession, email: str) -> User | None:
    stmt = (
        select(User)
        .where(User.email == email, User.deleted_at.is_(None))
        .options(selectinload(User.boards.and_(Board.deleted_at.is_(None))))
    )
    result = await session.execute(stmt)
    return result.scalar_one_or_none()


async def get_user_by_id(session: AsyncSession, user_id: UUID) -> User | None:
    stmt = select(User).where(User.id == user_id, User.deleted_at.is_(None))
    result = await session.execute(stmt)
    return result.scalar_one_or_none()


async def update_theme(session: AsyncSession, user_id: UUID, dark_theme: bool) -> None:
    stmt = update(User).where(User.id == user_id).values(dark_theme=dark_theme)
    await session.execute(stmt)
    await session.commit()


async def update_last_board(session: AsyncSession, user_id: UUID, board_id: UUID | None) -> None:
    stmt = update(User).where(User.id == user_id).values(
        last_board=board_id)
    await session.execute(stmt)
    await session.commit()


async def update_user_data(
    session: AsyncSession, user_id: UUID, firstname: str, lastname: str, date_of_birth: date, sex: str
) -> None:
    stmt = update(User).where(User.id == user_id).values(
        firstname=firstname,
        lastname=lastname,
        date_of_birth=date_of_birth,
        sex=sex
    )
    await session.execute(stmt)
    await session.commit()


async def soft_delete_user(session: AsyncSession, user_id: UUID) -> None:
    stmt = update(User).where(User.id == user_id).values(
        deleted_at=func.now())
    await session.execute(stmt)
    await session.commit()
