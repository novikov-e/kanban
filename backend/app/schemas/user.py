from datetime import date
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field
from pydantic.alias_generators import to_camel

from app.schemas.board import BoardShortResponse
from app.schemas.common import ApiRequest


class ThemeUpdateRequest(ApiRequest):
    id: UUID = Field(description="Идентификатор пользователя")
    dark_theme: bool = Field(description="Включить тёмную тему")


class LastBoardUpdateRequest(ApiRequest):
    user_id: UUID = Field(description="Идентификатор пользователя")
    board_id: UUID | None = Field(description="Доска, открываемая при следующем входе; null — доска закрыта")


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
