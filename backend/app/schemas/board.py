from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.column import ColumnResponse
from app.schemas.common import POSITION_DESCRIPTION


class BoardShortResponse(BaseModel):
    """Доска без вложенных колонок — элемент списка досок пользователя."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID = Field(validation_alias="board_id")
    name: str = Field(validation_alias="board_name")
    position: float = Field(validation_alias="board_position", description=POSITION_DESCRIPTION)


class BoardResponse(BoardShortResponse):
    """Доска целиком: колонки, задачи и подзадачи, каждый уровень отсортирован по позиции."""

    columns: list[ColumnResponse] = []
