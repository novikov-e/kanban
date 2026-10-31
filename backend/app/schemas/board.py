from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.column import ColumnResponse
from app.schemas.common import ApiRequest


class CreateBoardRequest(ApiRequest):
    """Создание доски с названием по умолчанию в конце списка досок пользователя."""

    parent_object_id: UUID = Field(description="Идентификатор пользователя — владельца доски")


class BoardShortResponse(BaseModel):
    """Доска без вложенных колонок — элемент списка досок пользователя."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID = Field(validation_alias="board_id")
    name: str = Field(validation_alias="board_name")
    position: int = Field(validation_alias="board_position", description="Позиция в списке досок, с нуля")


class BoardResponse(BoardShortResponse):
    """Доска целиком: колонки, задачи и подзадачи, каждый уровень отсортирован по позиции."""

    columns: list[ColumnResponse] = []
