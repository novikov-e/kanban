from datetime import date
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field
from pydantic.alias_generators import to_camel

from app.schemas.board import BoardShortResponse
from app.schemas.common import ApiRequest


class UserUpdateRequest(ApiRequest):
    """Частичное изменение: переданные поля меняются, остальные остаются как есть."""

    dark_theme: bool | None = Field(default=None, description="Включить тёмную тему")
    last_board_id: UUID | None = Field(
        default=None, description="Доска, открываемая при следующем входе; null — доска закрыта"
    )
    firstname: str | None = Field(default=None, max_length=50, description="Имя")
    lastname: str | None = Field(default=None, max_length=50, description="Фамилия")
    date_of_birth: date | None = Field(default=None, description="Дата рождения")
    sex: Literal["M", "F"] | None = Field(default=None, description="Пол: M или F")
    email: EmailStr | None = Field(default=None, description="Email")
    current_password: str | None = Field(default=None, description="Текущий пароль, обязателен при смене пароля")
    new_password: str | None = Field(default=None, min_length=8, max_length=128, description="Новый пароль")


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True, alias_generator=to_camel)

    id: UUID
    firstname: str | None
    lastname: str | None
    date_of_birth: date | None
    sex: str | None = Field(description="Пол: M или F")
    email: EmailStr
    dark_theme: bool
    last_board: UUID | None = Field(description="Доска, открытая при последнем входе")
    boards: list[BoardShortResponse] = Field(default=[], description="Доски пользователя в порядке позиций")
