from datetime import date
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field
from pydantic.alias_generators import to_camel

from app.schemas.board import BoardShortResponse

# Аналог ThemeDto


class ThemeUpdate(BaseModel):
    id: UUID
    dark_theme: bool = Field(alias="darkTheme")

# Аналог LastProjectDto


class LastProjectUpdate(BaseModel):
    user_id: UUID = Field(alias="userId")
    # null — пользователь закрыл проект
    project_id: UUID | None = Field(alias="projectId")


class UserUpdate(BaseModel):
    firstname: str
    lastname: str
    date_of_birth: date = Field(alias="dateOfBirth")
    sex: str

# Ответ API


class UserResponse(BaseModel):
    id: UUID
    firstname: str | None
    lastname: str | None
    date_of_birth: date | None
    sex: str | None
    image: str | None
    email: EmailStr
    dark_theme: bool
    last_project: UUID | None
    projects: list[BoardShortResponse] = Field(default=[], validation_alias="boards")

    model_config = ConfigDict(from_attributes=True, populate_by_name=True, alias_generator=to_camel)
