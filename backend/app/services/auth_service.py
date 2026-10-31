from dataclasses import dataclass
from uuid import UUID

from sqlalchemy import func, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.errors import AuthError, ConflictError
from app.core.security import IssuedToken, TokenType, create_token, decode_token, hash_password, verify_password
from app.models import RefreshToken, User

# Хеш для сравнения, когда пользователь не найден: иначе по времени ответа можно узнать, зарегистрирован ли email
_DUMMY_PASSWORD_HASH = hash_password("dummy-password")


@dataclass(frozen=True)
class TokenPair:
    access: IssuedToken
    refresh: IssuedToken


async def register(
    session: AsyncSession, email: str, password: str, firstname: str | None, lastname: str | None
) -> TokenPair:
    email = email.lower()
    if (await session.execute(select(User.id).where(User.email == email))).scalar_one_or_none() is not None:
        raise ConflictError("Email already registered")
    user = User(email=email, password=hash_password(password), firstname=firstname, lastname=lastname)
    session.add(user)
    await session.flush()
    return await _issue_tokens(session, user.id)


async def login(session: AsyncSession, email: str, password: str) -> TokenPair:
    stmt = select(User.id, User.password).where(User.email == email.lower(), User.deleted_at.is_(None))
    row = (await session.execute(stmt)).one_or_none()
    if row is None:
        verify_password(password, _DUMMY_PASSWORD_HASH)
        raise AuthError("Invalid email or password")
    if not verify_password(password, row.password):
        raise AuthError("Invalid email or password")
    return await _issue_tokens(session, row.id)


async def refresh(session: AsyncSession, refresh_token: str) -> TokenPair:
    claims = decode_token(refresh_token, TokenType.REFRESH)
    stmt = (
        update(RefreshToken)
        .where(
            RefreshToken.token_id == claims.token_id,
            RefreshToken.user_id == claims.user_id,
            RefreshToken.revoked_at.is_(None),
            RefreshToken.expires_at > func.now(),
        )
        .values(revoked_at=func.now())
    )
    if (await session.execute(stmt)).rowcount == 0:
        if await _is_revoked(session, claims.token_id):
            # Повторное использование отозванного токена означает его утечку: отзываем все сессии пользователя
            await _revoke_all(session, claims.user_id)
            await session.commit()
        raise AuthError("Refresh token is revoked or expired")
    return await _issue_tokens(session, claims.user_id)


async def logout(session: AsyncSession, refresh_token: str) -> None:
    try:
        claims = decode_token(refresh_token, TokenType.REFRESH)
    except AuthError:
        return
    stmt = (
        update(RefreshToken)
        .where(RefreshToken.token_id == claims.token_id, RefreshToken.revoked_at.is_(None))
        .values(revoked_at=func.now())
    )
    await session.execute(stmt)
    await session.commit()


async def _issue_tokens(session: AsyncSession, user_id: UUID) -> TokenPair:
    tokens = TokenPair(access=create_token(user_id, TokenType.ACCESS), refresh=create_token(user_id, TokenType.REFRESH))
    session.add(RefreshToken(token_id=tokens.refresh.token_id, user_id=user_id, expires_at=tokens.refresh.expires_at))
    await session.commit()
    return tokens


async def _is_revoked(session: AsyncSession, token_id: UUID) -> bool:
    stmt = select(RefreshToken.revoked_at).where(RefreshToken.token_id == token_id)
    return (await session.execute(stmt)).scalar_one_or_none() is not None


async def _revoke_all(session: AsyncSession, user_id: UUID) -> None:
    stmt = (
        update(RefreshToken)
        .where(RefreshToken.user_id == user_id, RefreshToken.revoked_at.is_(None))
        .values(revoked_at=func.now())
    )
    await session.execute(stmt)
