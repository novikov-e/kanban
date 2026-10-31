from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field
from pydantic.alias_generators import to_camel

from app.schemas.common import ApiRequest


class LoginRequest(ApiRequest):
    email: EmailStr = Field(examples=["user@example.com"])
    password: str = Field(examples=["password"])


class RegisterRequest(ApiRequest):
    email: EmailStr = Field(examples=["user@example.com"])
    password: str = Field(min_length=8, max_length=128, description="Пароль, от 8 до 128 символов")
    firstname: str | None = Field(default=None, max_length=50)
    lastname: str | None = Field(default=None, max_length=50)


class TokenResponse(BaseModel):
    """Access-токен для заголовка `Authorization: Bearer`. Refresh-токен приходит в httpOnly cookie."""

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    access_token: str
    token_type: Literal["bearer"] = "bearer"
    expires_in: int = Field(description="Время жизни access-токена в секундах")
