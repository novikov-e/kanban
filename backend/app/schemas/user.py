from datetime import date
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field
from pydantic.alias_generators import to_camel

from app.schemas.board import BoardShortResponse
from app.schemas.common import ApiRequest


class UserUpdateRequest(ApiRequest):
    """Частичное изменение настроек: переданные поля меняются, остальные остаются как есть."""

    dark_theme: bool | None = Field(default=None, description="Включить тёмную тему")
    last_board_id: UUID | None = Field(
        default=None, description="Доска, открываемая при следующем входе; null — доска закрыта"
    )


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True, alias_generator=to_camel)

    id: UUID
    firstname: str | None
    lastname: str | None
    date_of_birth: date | None
    sex: str | None = Field(description="Пол: M или F")
    image: str | None = Field(description="Ссылка на аватар")
    email: EmailStr
    dark_theme: bool
    last_board: UUID | None = Field(description="Доска, открытая при последнем входе")
    boards: list[BoardShortResponse] = Field(default=[], description="Доски пользователя в порядке позиций")
