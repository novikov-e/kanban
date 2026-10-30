from datetime import date
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field
from pydantic.alias_generators import to_camel

from app.schemas.board import BoardShortResponse


class ThemeUpdate(BaseModel):
    id: UUID
    dark_theme: bool = Field(alias="darkTheme")


class LastBoardUpdate(BaseModel):
    user_id: UUID = Field(alias="userId")
    # null — пользователь закрыл доску
    board_id: UUID | None = Field(alias="boardId")


class UserUpdate(BaseModel):
    firstname: str
    lastname: str
    date_of_birth: date = Field(alias="dateOfBirth")
    sex: str


class UserResponse(BaseModel):
    id: UUID
    firstname: str | None
    lastname: str | None
    date_of_birth: date | None
    sex: str | None
    image: str | None
    email: EmailStr
    dark_theme: bool
    last_board: UUID | None
    boards: list[BoardShortResponse] = []

    model_config = ConfigDict(from_attributes=True, populate_by_name=True, alias_generator=to_camel)
