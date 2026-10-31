from dataclasses import dataclass
from datetime import UTC, datetime, timedelta
from enum import StrEnum
from uuid import UUID, uuid4

import jwt
from pwdlib import PasswordHash

from app.core.config import settings
from app.core.errors import AuthError

_password_hash = PasswordHash.recommended()


class TokenType(StrEnum):
    ACCESS = "access"
    REFRESH = "refresh"


@dataclass(frozen=True)
class IssuedToken:
    value: str
    token_id: UUID
    expires_at: datetime


@dataclass(frozen=True)
class TokenClaims:
    user_id: UUID
    token_id: UUID


ACCESS_TOKEN_TTL = timedelta(minutes=settings.ACCESS_TOKEN_TTL_MINUTES)
REFRESH_TOKEN_TTL = timedelta(days=settings.REFRESH_TOKEN_TTL_DAYS)


def hash_password(password: str) -> str:
    return _password_hash.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    return _password_hash.verify(password, password_hash)


def create_token(user_id: UUID, token_type: TokenType) -> IssuedToken:
    issued_at = datetime.now(UTC)
    expires_at = issued_at + (ACCESS_TOKEN_TTL if token_type is TokenType.ACCESS else REFRESH_TOKEN_TTL)
    token_id = uuid4()
    claims = {"sub": str(user_id), "type": token_type, "jti": str(token_id), "iat": issued_at, "exp": expires_at}
    value = jwt.encode(claims, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return IssuedToken(value=value, token_id=token_id, expires_at=expires_at)


def decode_token(token: str, token_type: TokenType) -> TokenClaims:
    try:
        claims = jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM],
            options={"require": ["sub", "type", "jti", "exp"]},
        )
    except jwt.InvalidTokenError as error:
        raise AuthError("Invalid token") from error
    if claims["type"] != token_type:
        raise AuthError("Invalid token type")
    return TokenClaims(user_id=UUID(claims["sub"]), token_id=UUID(claims["jti"]))
